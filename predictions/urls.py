from django.urls import path
from .views import CropPredictionView,save_farmer_decision

urlpatterns = [
    path('predict/', CropPredictionView.as_view(), name='predict'),
    path('save-decision/', save_farmer_decision)
]