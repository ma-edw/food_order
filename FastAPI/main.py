import re
from typing import Annotated, List, Optional
from annotated_types import Interval
from pydantic import computed_field, ValidationError
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import func
from pathlib import Path
from fastapi import FastAPI, HTTPException
# from random import randint
import datetime

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# For frontend
origins = {
    "http://localhost:3000",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']    
)

CSV_FILE = 'menu_all.csv'
DB_PATH = 'menu_all.db'
SQLDB_PATH = 'sqlite:///' + DB_PATH

MIN_NO_OF_DISHES: int = 2
MAX_NO_OF_DISHES: int = 4
MAX_NO_OF_FISH_DISHES: int = 3
BASE_PRICE: int  = 35
PERDISH_PRICE: int = 8
FISH_BASE_PRICE: int = 58

FISH_DISH: str = "豆豉蒸倉魚"

UPGRADE_DRINK_PRICE = 6
ADD_SIDEDISH_PRICE = 25

class Dish(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    wday: Annotated[int, Interval(ge=0, le=7)] 
    
def today_weekday() -> int:
    weekday = datetime.datetime.today().weekday() + 1 # 1-7 for Mon-Sun
    return weekday
###################################################################################################
# Importing data
if Path(DB_PATH).exists():
    engine = create_engine(SQLDB_PATH)
    print("DB已建立，跳過CSV")
else:
    engine = create_engine(SQLDB_PATH)
    with open(CSV_FILE, 'r', encoding='utf-8') as file_descriptor:
        csv_content: list[str] = file_descriptor.readlines()
    csv_content.pop()
    pattern = re.compile(r"[0-9\. \n\*]+")
    fields_list: list[str] = []
    for line in csv_content:
        fields_list.append(line.split(","))
    dish_by_wday = list(zip(*fields_list))

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        for i in range(len(dish_by_wday)):
            for x in dish_by_wday[i]:
                session.add(Dish(name=pattern.sub('', x), wday=i))
            session.commit()

# Get meal sets from imported data
meal_sets = []
for i in range(7):
    statement = select(Dish).where(Dish.wday == i)
    meal_set = []
    with Session(engine) as session:
        selected_dishes = session.exec(statement)
        for d in selected_dishes:
            meal_set.append(d.name)
    meal_sets.append(meal_set)
###################################################################################################
class Order_old(SQLModel, table=False):
    wday: int
    menu: List[str]
    dishes: List[str]
    add_sidedish: bool
    upgrade_drink: bool
    fish_meal: bool
    
    def __init__(self) -> None:
        self.wday = today_weekday()
        self.menu = self.set_menu(weekday=self.wday)
        self.dishes = []
        self.add_sidedish = False
        self.upgrade_drink = False
        self.fish_meal = False
        
        # set menu
        self.set_menu(self.wday)
    
    def reset(self):
        self.wday = today_weekday()
        self.menu = self.set_menu(weekday=self.wday)
        self.dishes = []
        self.add_sidedish = False
        self.upgrade_drink = False
        self.fish_meal = False
        
        # set menu
        self.set_menu(self.wday)
        
    def toggle_fishmeal(self) -> None:
        self.fish_meal = not self.fish_meal
    
    def set_menu(self, weekday: Annotated[int, Interval(ge=1, le=7)]) -> None:
        self.wday = weekday
        self.menu = []
        self.dishes = []
        # set menu for the particular weekday
        statement = select(Dish).where(Dish.wday == weekday - 1)
        with Session(engine) as session:
            selected_dishes = session.exec(statement)
            for d in selected_dishes:
                self.menu.append(d.name)
                
class Order(SQLModel, table=False):
    wday: int
    menu: List[str]
    dishes: List[str]
    add_sidedish: bool
    upgrade_drink: bool
    fish_meal: bool
    
    def __init__(self) -> None:
        self.wday = today_weekday()
        self.menu = self.set_menu(weekday=self.wday)
        self.dishes = []
        self.add_sidedish = False
        self.upgrade_drink = False
        self.fish_meal = False
        
        # set menu
        self.set_menu(self.wday)
    
    def reset(self):
        self.wday = today_weekday()
        self.menu = self.set_menu(weekday=self.wday)
        self.dishes = []
        self.add_sidedish = False
        self.upgrade_drink = False
        self.fish_meal = False
        
        # set menu
        self.set_menu(self.wday)
        
    def toggle_fishmeal(self) -> None:
        self.fish_meal = not self.fish_meal
        # Add/remove fish to order
        if self.fish_meal:
            self.add_dish(FISH_DISH)
        else:
            self.del_dish(FISH_DISH)
    
    def set_menu(self, weekday: Annotated[int, Interval(ge=1, le=7)]) -> None:
        self.wday = weekday
        self.menu = []
        self.dishes = []
        # set menu for the particular weekday
        statement = select(Dish).where(Dish.wday == weekday - 1)
        with Session(engine) as session:
            selected_dishes = session.exec(statement)
            for d in selected_dishes:
                self.menu.append(d.name)            
                
    def min_dishes(self):
        return MIN_NO_OF_DISHES
        
    def max_dishes(self):
        if self.fish_meal:
            return MAX_NO_OF_FISH_DISHES
        else:
            return MAX_NO_OF_DISHES  
            
    def add_dish(self, dish: str) -> None:                        
        # Add dish if it is in menu and not already ordered
        if dish not in self.dishes:
            self.dishes.append(dish)
    
    def del_dish(self, dish: str) -> None:                
        # Remove dish if dish is indeed ordered already
        if dish in self.dishes:
            self.dishes.remove(dish)
    
    def toggle_add_sidedish(self) -> None:
        self.add_sidedish = not self.add_sidedish
        
    def toggle_upgrade_drink(self) -> None:
        self.upgrade_drink = not self.upgrade_drink    
       
    def legit(self) -> bool:
        # Check if all dishes are included in menu
        for dish in self.dishes:
            if dish not in self.menu and dish != FISH_DISH:
                return False
        # Check if dish count is OK
        if len(self.dishes) < self.min_dishes():
            return False
        if len(self.dishes) > self.max_dishes():
            return False
        return True
    
    def num_extra_dishes(self):
        return max(0, len(self.dishes) - self.min_dishes())
    
    # base price without extra dishes
    def base_price(self):
        if self.fish_meal:
            return FISH_BASE_PRICE
        else:
            return BASE_PRICE
        
    def extra_dishes_price(self):
        return self.num_extra_dishes() * PERDISH_PRICE
    
    # total price: base price + price for extra dishes + addons
    @computed_field
    def price(self) -> int: 
        price: int = 0
        if not self.legit():
            raise Exception('Order not legit')  
        price = self.base_price() + self.extra_dishes_price()
        if self.add_sidedish:
            price += ADD_SIDEDISH_PRICE
        if self.upgrade_drink:
            price += UPGRADE_DRINK_PRICE
        return price

###################################################################################################
order = Order()

@app.get("/")
def read_root():
    return {"Greeting": "歡迎幫襯兩餸飯"}

@app.post("/reset/")
def reset() -> None:
    try:
        order.reset()  
    except Exception as e:
        return(str(e))  

@app.get("/day/")
def get_wday():
    return order.wday

@app.get("/meal_sets/")
def get_meal_sets() -> List[List[str]]:
    return meal_sets

@app.get("/menu/")
def get_menu() -> List[str]:
    return order.menu

@app.get("/dishes")
def get_dishes() -> List[str]:
    return order.dishes

@app.post("/add/{dish}")
def dish_add(dish: str) -> list[str]:
    try:
        order.add_dish(dish)
        return order.dishes
    except Exception as e:
        return (str(e))

@app.post("/del/{dish}")
def dish_del(dish: str) -> list[str]:
    try:
        order.del_dish(dish)
        return order.dishes
    except Exception as e:
        return (str(e))   

@app.post("/fishmeal")
def change_if_fishmeal() -> str:
    order.toggle_fishmeal()
    return "fishmeal: " + str(order.fish_meal)

    
@app.get("/isfishmeal")
def get_is_fishmeal() -> str:
    if order.fish_meal == True:
        return "是"
    else:
        return "否"

@app.post("/sidedish")
def change_if_add_sidedish() -> str:
    order.toggle_add_sidedish()
    return "Add sidedish: " + str(order.add_sidedish) + ", " + "Upgrade drink: " + str(order.upgrade_drink)

@app.post("/drink")
def change_if_upgrade_drink() -> str:
    order.toggle_upgrade_drink()
    return "Add sidedish: " + str(order.add_sidedish) + ", " + "Upgrade drink: " + str(order.upgrade_drink)

@app.get("/addons")
def get_if_upgrade() -> str:
    return "Add sidedish: " + str(order.add_sidedish) + ", " + "Upgrade drink: " + str(order.upgrade_drink)

@app.get("/ifsidedish")
def get_if_sidedish() -> str:
    if order.add_sidedish == True:
        return "是"
    else:
        return "否"    

@app.get("/ifupgradedrink")
def get_if_upgrade_drink() -> str:
    if order.upgrade_drink == True:
        return "是"
    else:
        return "否"

@app.get("/legit")
def get_if_legit() -> str:
    if order.legit() == True:
        return "是"
    else:
        return "否"

@app.get("/base_price")
def get_base_price() -> int:
    return order.base_price()

@app.get("/extra_dishes")
def get_dishes() -> int:
    return order.num_extra_dishes()

@app.get("/extra_dishes_price")
def get_extra_dishes_price() -> int:
    return order.extra_dishes_price()

@app.get("/sidedish_price")
def get_sidedish_price() -> int:
    return ADD_SIDEDISH_PRICE

@app.get("/drink_price")
def get_drink_price() -> int:
    return UPGRADE_DRINK_PRICE
    
@app.get("/price")
def get_price() -> int:
    try:
        return order.price
    except:
        return 0
