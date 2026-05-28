"""
Task 8.1 Data Classes and Enums
"""

__author__ = "Nishan Pokharel"

from dataclasses import dataclass
from enum import Enum


class CoffeeType(Enum):
    ESPRESS0 = "Espresso"
    LONG_BLACK = "Long Black"
    LATTE = "Latte"
    CAPPUCCINO = "Cappuccino"
    MOCHA = "Mocha"


@dataclass
class Order:
    name : str 
    coffee_type : CoffeeType
    sugars : int
    upsize : bool
    

    def __str__(self) -> str:
      size = "large" if self.upsize else "Regular"
      sugar_word = "sugar" if self.sugars == 1 else "sugars"
      return f"Order for {self.name}: {size} {self.coffee_type.value} with {self.sugars} {sugar_word}"
    

def input_coffee_type() -> CoffeeType:
    """
    Briefly describe what the function does
    """
    Choice = None
    coffee = None
    while Choice is None:
        print("Which coffee would you like?")
        print("1. Espresso")
        print("2. Long Black")
        print("3. Latte")
        print("4. Cappuccino")
        print("5. Mocha")
        Choice = input("choice: ")
        match Choice:
            case "1":
                coffee = CoffeeType.ESPRESS0
            case "2":
                coffee = CoffeeType.LONG_BLACK
            case "3":
                coffee = CoffeeType.LATTE
            case "4":
                coffee = CoffeeType.CAPPUCCINO
            case "5":
                coffee = CoffeeType.MOCHA
            case _:
                print("Invalid selection")
    return coffee
            

def input_order() -> Order:
    """
    Briefly describe what the function does
    """
    print("Place your coffee order here!")
    name = input("your name: ")
    coffee_type = input_coffee_type()
    sugars = -1
    while sugars < 0:
        sugars = int(input("How many Sugars? "))
        if sugars < 0:
         print("S0orry, we can't add negative sugars ;-)")
    upsize_input = input("Would you like to upsize to a large (y/n) ")
    upsize = upsize_input.strip().lower() == "y"
    return Order (name=name, coffee_type=coffee_type, sugars=sugars, upsize=upsize)


def main():
    order: Order
    order = input_order()
    print()
    print(order)
    

if __name__ == "__main__":
    main()