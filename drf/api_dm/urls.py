from django.urls import path, include
from api_dm import views
from rest_framework.routers import DefaultRouter

app_name = 'dm'

router = DefaultRouter()
# 同じserializerを参照している場合第三引数にbasenameを指定する
router.register('message', views.MessageViewSet, basename='message')
router.register('inbox', views.InboxListView, basename='inbox')


urlpatterns = [

    path('', include(router.urls))
]
