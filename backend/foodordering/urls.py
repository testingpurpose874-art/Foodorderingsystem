from django.urls import path
from .views import *

urlpatterns = [
  path('admin-login/',admin_login_api),
  path('add-category/',add_category),
  path('categories/',list_categories),
  path('add-food-item/',add_food_item),
  path('foods/',list_foods),
  path('food_search/',food_search),
  path('random_foods/',random_foods),
  path('register/',register_user),
  path('login/',login_user),
  path('foods/<int:id>/',food_detail),
  path('cart/add/',add_to_cart),
  path('cart/<int:user_id>/',get_cart_items),
  # path('cart/update_quantity/',update_cart_quantity),
]