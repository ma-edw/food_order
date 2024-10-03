import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import * as Constants from "../constants/constants"

const Menu = () => {
    const navigate = useNavigate();

    // // Meal Info
    // const infoFishMeal1 = "蒸魚餐（$58）包蒸倉魚 + 1個餸"
    // const infoFishMeal2 = "請最少選1個餸"
    // const infoFishMeal3 = "最多可以揀2個餸（第2個餸加$8）"

    // const infoStdMeal1 = "普通餐（$35）包2個餸"
    // const infoStdMeal2 = "請最少選2個餸"
    // const infoStdMeal3 = "最多可以揀4個餸（第3-4個餸每個加$8）"

    // Toggle fish meal
    const [stdMealSet, setStdMealSet] = useState(true)
    const handleFishMeal = () => {
        // Backend
        api.post("/fishmeal");
        // Change instructions to for user - frontend
        // if (stdMealSet === true) {
        //     setStdMealSet(false);
        // } else {
        //     setStdMealSet(true);
        // };
        setStdMealSet(!stdMealSet);
    };

    // Day of the menu - backend
    const [day, setDay] = useState();
    const weekNumbers = ["一", "二", "三", "四", "五", "六", "日"];
    const fetchDay = async () => {
        const response = await api.get("/day");
        const intWeekDay = response.data;
        const chinWeekDay = weekNumbers[intWeekDay - 1]
        setDay(chinWeekDay);
    };
    useEffect(() => {
        fetchDay();
    }, []);


    // Menu - backend
    const [menu, setMenu] = useState([]);
    const fetchMenu = async () => {
        const response = await api.get("/menu");
        setMenu(response.data);
    };
    useEffect(() => {
        fetchMenu();
    }, []);

    // Add a dish to order - backend
    const handleAddDish = (dish) => {
        api.post(`/add/${dish}`);
    };

    // Remove a dish from order - backend
    const handleDelDish = (dish) => {
        api.post(`/del/${dish}`);
    };

    // Dishes checked - frontend
    const [dishesChecked, setDishesChecked] = useState([]);
    const handleDishChecked = (event) => {
        if (!(dishesChecked.includes(event.target.value))) {
            // check the dish (frontend)
            setDishesChecked([...dishesChecked, event.target.value])
            // add the dish (backend)
            handleAddDish(event.target.value);
        } else {
            // uncheck the dish (frontend)
            const newDishesChecked = dishesChecked.filter((dish) => dish !== event.target.value);
            setDishesChecked(newDishesChecked);
            // remove the dish (backend)
            handleDelDish(event.target.value);
        };
        fetchLegit();
    }

    // // Toggle sidedish - backend
    // const [sidedishPrice, setSidedishPrice] = useState(0);
    // const fetchSidedishPrice = async () => {
    //     const response = await api.get("/sidedish_price");
    //     setSidedishPrice(response.data);
    // };
    // useEffect(() => {
    //     fetchSidedishPrice();
    // }, []);

    // const [drinkPrice, setDrinkPrice] = useState(0);
    // const fetchDrinkPrice = async () => {
    //     const response = await api.get("/drink_price");
    //     setDrinkPrice(response.data);
    // };
    // useEffect(() => {
    //     fetchDrinkPrice();
    // }, []);

    const handleSidedish = () => {
        api.post("/sidedish");
    };
    // Toggle drink upgrade - backend
    const handleDrink = () => {
        api.post("/drink");
    };

    // Check if order is legit
    const [isLegit, setIsLegit] = useState("No");
    const fetchLegit = async () => {
        const response = await api.get("/legit");
        setIsLegit(response.data);                
    };
    useEffect(() => {
        fetchLegit();
    }, []);

    // Add checked dishes - backend
    const handleSubmitDishes = () => {
        // fetchLegit();
        // Go to checkout page if order is legit
        if (isLegit === "是") {
            navigate("/checkout");
        // reset order if order is not legit
        } else {
            api.post("/reset");
            navigate("/");
        }

        // navigate("/checkout");
    };

    // Reset - reset order and go back to new order page
    const handleCancel = () => {
        api.post("/reset");
        navigate("/");
    };

    return (        
        <div class="col d-flex justify-content-center">
            <div class="card" style={{ minWidth: '300px' }}>
                <div class="card-body">
                    <h5>星期{day}套餐</h5>
                    <br />
                    <h6>套餐</h6>                    
                    <div>
                        <input type="checkbox" onChange={handleFishMeal} />
                        <span> 轉蒸魚餐</span>
                    </div>
                    <br />
                    <h6>餸</h6>
                    <div>{stdMealSet ? Constants.infoStdMeal1 : Constants.infoFishMeal1}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal2 : Constants.infoFishMeal2}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal3 : Constants.infoFishMeal3}</div>
                    <br />

                    <div>
                        {menu.map((dish) => (
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={dish}
                                        onChange={handleDishChecked}
                                    />
                                    {dish}
                                </label>
                            </div>
                        ))}
                        <br />
                    </div>

                    <h6>附加</h6>
                    <div>
                        <input type="checkbox" onChange={handleSidedish} />
                        <span> 加小食（+${Constants.sidedish_price}）</span>
                    </div>
                    <div>
                        <input type="checkbox" onChange={handleDrink} />
                        <span> 加特飲（+${Constants.drink_price}）</span>
                    </div>
                    <br />
                    
                    {/* <p>{isLegit}</p> */}
                    <button onClick={handleSubmitDishes} class="btn btn-primary" style={{ marginRight: '7.5px' }}>確認</button>
                    <button onClick={handleCancel} class="btn btn-outline-primary">取消</button>

                </div>
            </div>
        </div>
    );
};

export default Menu;
