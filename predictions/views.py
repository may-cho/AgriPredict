from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PredictionRequestSerializer, PredictionResponseSerializer
from .utils import predictor

class ProfitPredictionView(APIView):
    """
    POST /api/predict/
    Request body: JSON with crop, region, soil_type, area_acres,
                  planting_month, total_cost_per_acre,
                  monthly_rainfall (list), monthly_temp (list)
    """
    def post(self, request):
        serializer = PredictionRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                result = predictor.predict(serializer.validated_data)
                response_serializer = PredictionResponseSerializer(result)
                return Response(response_serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(serializer.errors)  # <--- ADD THIS LINE
            return Response(serializer.errors, status=400)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
