from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from django.contrib.auth import login
from .models import *

# Create your views here.

@api_view(['POST'])
def admin_login_api(request):
  username = request.data.get('username')
  password = request.data.get('password')

  user = authenticate(username=username,password=password)

  if user is not None and user.is_staff:
    login(request, user)
    return Response({"message":"Login successful","username":username},status=200)
  return Response({"message":"Invalid Credentials"},status=401)

@api_view(['POST'])
def add_category(request):
  category_name = request.data.get('category_name')

  Category.objects.create(category_name=category_name)
  return Response({"message":"Category has been created"},status=201)

from .serializers import CategorySerializer
@api_view(['GET'])
def list_categories(request):
  categories = Category.objects.all()
  serializer = CategorySerializer(categories,many=True)
  return Response(serializer.data)

from rest_framework.parsers import MultiPartParser,FormParser
from .serializers import FoodSerializer

@api_view(['POST'])
@parser_classes([MultiPartParser,FormParser])
def add_food_item(request):
  serializer = FoodSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response({"message":"Food item has been added"},status=201)
  return Response({"message":"Something went wrong"},status=400)

@api_view(['GET'])
def list_foods(request):
  foods = Food.objects.all()
  serializer = FoodSerializer(foods,many=True)
  return Response(serializer.data)

@api_view(['GET'])
def food_search(request):
  query = request.GET.get('q','')
  foods = Food.objects.filter(item_name__icontains=query)
  serializer = FoodSerializer(foods,many=True)
  return Response(serializer.data)

import random
@api_view(['GET'])
def random_foods(request):
  foods = list(Food.objects.all())
  random.shuffle(foods)
  limited_foods = foods[0:9]
  serializer = FoodSerializer(limited_foods,many=True)
  return Response(serializer.data)

from django.contrib.auth.hashers import make_password
@api_view(['POST'])
def register_user(request):
  first_name = request.data.get('firstname')
  last_name = request.data.get('lastname')
  email = request.data.get('email')
  mobile = request.data.get('mobilenumber')
  password = request.data.get('password')

  if User.objects.filter(email=email).exists() or User.objects.filter(mobile=mobile).exists():
    return Response({"message":"Email or mobile already registered"},status=400)
  User.objects.create(first_name=first_name,last_name=last_name,email=email,mobile=mobile,password=make_password(password))
  return Response({"message":"User registered successfully"},status=201)

from django.db.models import Q
from django.contrib.auth.hashers import check_password
@api_view(['POST'])
def login_user(request):
  identifier = request.data.get('emailcont')
  password = request.data.get('password')

  try:
    user = User.objects.get(Q(email=identifier) | Q(mobile=identifier))
    if check_password(password,user.password):
      return Response({"message":"Login Successful","userId":user.id,"userName":f"{user.first_name} {user.last_name}"},status=200)
    else:
      return Response({"message":"Invalid Credentials"},status=401)
  except:
    return Response({"message":"Invalid Credentials"},status=401)

from django.shortcuts import get_object_or_404
@api_view(['GET'])
def food_detail(request,id):
  food = get_object_or_404(Food,id=id)
  serializer = FoodSerializer(food)
  return Response(serializer.data)

@api_view(['POST'])
def add_to_cart(request):
  user_id = request.data.get('userId')
  food_id = request.data.get('foodId')

  # print("USER ID:", user_id)
  # print("FOOD ID:", food_id)
  
  try:
    user = User.objects.get(id=user_id)
    food = Food.objects.get(id=food_id)

    order,created = Order.objects.get_or_create(
      user = user,
      food = food,
      is_order_placed=False,
      # quantity = 1,
      defaults={'quantity':1}
    )
    if not created:
      order.quantity += 1
      order.save()

    return Response({"message":"Food added to cart successfully"},status=200)
  
  # except User.DoesNotExist:
  #       return Response({
  #           "message": f"User with id {user_id} does not exist"
  #       }, status=404)

  # except Food.DoesNotExist:
  #     return Response({
  #         "message": f"Food with id {food_id} does not exist"
  #     }, status=404)

  # except Exception as e:
  #         print("ERROR:", str(e))
  #         return Response({
  #             "message": str(e)
  #         }, status=500)

  except:
    return Response({"message":"Something went wrong"},status=404)

from .serializers import CartOrderSerializer
@api_view(['GET'])
def get_cart_items(request, user_id):
  orders = Order.objects.filter(user_id=user_id,is_order_placed=False).select_related('food')
  serializer = CartOrderSerializer(orders,many=True)
  return Response(serializer.data)
  
# @api_view(['PUT'])
# def update_cart_quantity(request):
#   order_id = request.data.get('orderId')
#   quantity = request.data.get('quantity')

  # try:
  #   order = Order.objects.get(id=order_id, is_order_placed=False)
  #   order.quantity = quantity
  #   order.save()

  #   return Response({'message':'quantity updated successfully'},status=200)
