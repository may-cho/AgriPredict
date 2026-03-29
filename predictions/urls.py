from django.urls import path
from .views import CropPredictionView,save_farmer_decision,get_crop_status

urlpatterns = [
    path('predict/', CropPredictionView.as_view(), name='predict'),
    path('save-decision/', save_farmer_decision),
    path('crop-status/<int:cycle_id>/',get_crop_status)
]