import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import * as Constants from "../constants/constants"

const Menu = () => {
    const navigate = useNavigate();

    // Toggle fish meal
    const [stdMealSet, setStdMealSet] = useState(false);
    const [maxToCheck, setMaxToCheck] = useState(Constants.max_std_num_checked);
    const [minToCheck, setMinToCheck] = useState(Constants.min_std_num_checked);

    const fetchIfFishMeal = async () => {
        const response = await api.get("/isfishmeal");
        const isFishMeal = response.data;
        if (isFishMeal === "是") {
            setStdMealSet(false);
            setMinToCheck(Constants.min_fish_num_checked);
            setMaxToCheck(Constants.max_fish_num_checked);
        } else {
            setStdMealSet(true);
            setMinToCheck(Constants.min_std_num_checked);
            setMaxToCheck(Constants.max_std_num_checked);
        };
    };
    useEffect(() => {
        fetchIfFishMeal();
    }, []);

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

    const [dishesChecked, setDishesChecked] = useState([]);
    const handleDishChecked = (event) => {
        // handle checking a box
        if (dishesChecked.length < maxToCheck && !(dishesChecked.includes(event.target.value))) {
            // check the dish (frontend)
            setDishesChecked([...dishesChecked, event.target.value])
            // add the dish (backend)
            handleAddDish(event.target.value);
        // handle unchecking a box
        } else {
            // uncheck the dish (frontend)
            const newDishesChecked = dishesChecked.filter((dish) => dish !== event.target.value);
            setDishesChecked(newDishesChecked);
            // remove the dish (backend)
            handleDelDish(event.target.value);
        };
        fetchLegit();
    }

    const handleSidedish = () => {
        api.post("/sidedish");
    };
    // Toggle drink upgrade - backend
    const handleDrink = () => {
        api.post("/drink");
    };

    // Check if order is legit
    const [isLegit, setIsLegit] = useState("");
    const fetchLegit = async () => {
        const response = await api.get("/legit");
        setIsLegit(response.data);
    };
    useEffect(() => {
        fetchLegit();
    }, []);

    // Error message when too little/many dishes are checked
    const [errorMessage, setErrorMessage] = useState("")

    // Add checked dishes - backend
    const handleSubmit = () => {
        // Proceed to checkout page if order is legit 
        if (isLegit === "是") {
            setErrorMessage("")
            navigate("/checkout");
        } else {
            if (isLegit === "否") {
                if (dishesChecked.length < minToCheck) {
                    setErrorMessage("請最少選" + minToCheck + "個餸")
                } else {
                    if (dishesChecked.length > maxToCheck) { 
                        setErrorMessage("最多可選" + maxToCheck + "個餸")
                    }                
                };
            };
        };
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

                    <div>{stdMealSet ? Constants.infoStdMeal1 : Constants.infoFishMeal1}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal2 : Constants.infoFishMeal2}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal3 : Constants.infoFishMeal3}</div>
                    <br />

                    <h6>餸</h6>
                    <div>
                        {menu.map((dish) => (
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={dish}
                                        onChange={handleDishChecked}
                                        checked={dishesChecked.includes(dish)}
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
                        <span> 加小食 ${Constants.sidedish_price}</span>
                    </div>
                    <div>
                        <input type="checkbox" onChange={handleDrink} />
                        <span> 加特飲 ${Constants.drink_price}</span>
                    </div>
                    <br />

                    <p style={{ color: 'red' }}>{errorMessage}</p>
                    
                    <button onClick={handleSubmit} class="btn btn-primary" style={{ marginRight: '7.5px' }}>確認</button>
                    <button onClick={handleCancel} class="btn btn-outline-primary">取消</button>

                </div>
            </div>
        </div>
    );
};

export default Menu;
