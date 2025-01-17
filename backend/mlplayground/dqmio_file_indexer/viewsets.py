import logging

from custom_auth.keycloak import KeycloakAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from dqmio_celery_tasks.serializers import TaskResponseBase, TaskResponseSerializer
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import FileIndexFilter
from .models import FileIndex
from .serializers import FileIndexSerializer
from .tasks import index_files_and_schedule_hists

logger = logging.getLogger(__name__)


class FileIndexViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = FileIndex.objects.all().order_by("st_itime")
    serializer_class = FileIndexSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = FileIndexFilter
    authentication_classes = [KeycloakAuthentication]

    @extend_schema(
        request=None,
        responses={200: TaskResponseSerializer},
    )
    @action(
        detail=False,
        methods=["post"],
        name="Trigger file indexing and automatic ingestion schedule",
        url_path=r"index-and-ingest",
    )
    def run(self, request):
        task = index_files_and_schedule_hists.delay()
        task = TaskResponseBase(id=task.id, state=task.state, ready=task.ready())
        task = TaskResponseSerializer(task)
        return Response(task.data)
