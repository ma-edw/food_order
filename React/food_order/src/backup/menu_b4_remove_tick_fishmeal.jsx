import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import * as Constants from "../constants/constants"

const Menu = () => {
    const navigate = useNavigate();

    // Toggle fish meal
    const [stdMealSet, setStdMealSet] = useState(true);
    // const fetchIfFishMeal = async () => {
    //     const response = await api.get("/ifsidedish");
    //     const isFishMeal = response.data;
    //     // const response = await api.get("/menu");
    //     // setMenu(response.data);
    //     if (isFishMeal === "是") {
    //         setStdMealSet(false);
    //     } else {
    //         if (isFishMeal === "否") {
    //             setStdMealSet(true);
    //         };
    //     };
    // };
    // useEffect(() => {
    //     fetchIfFishMeal();
    // }, []);

    const handleFishMeal = () => {
        // Backend
        api.post("/fishmeal");
        
        // Change instructions to for user - frontend
        // if (stdMealSet === true) {
        //     setStdMealSet(false);
        // } else {
        //     setStdMealSet(true);
        // };

        // fetchIfFishMeal();
        setStdMealSet(!stdMealSet);
        setMinMax();
    };

    // set min and max no. of boxes to check (based on mealset, default std mealset)
    const [maxToCheck, setMaxToCheck] = useState(Constants.max_std_num_checked);
    const [minToCheck, setMinToCheck] = useState(Constants.min_std_num_checked);
    const setMinMax = () => {
        if (stdMealSet === true) {
            setMinToCheck(Constants.min_std_num_checked);
            setMaxToCheck(Constants.max_std_num_checked);
        } else {
            setMinToCheck(Constants.min_fish_num_checked);
            setMaxToCheck(Constants.max_fish_num_checked);
        };
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
    // b4 validation
    // const [dishesChecked, setDishesChecked] = useState([]);
    // const handleDishChecked = (event) => {
    //     if (!(dishesChecked.includes(event.target.value))) {
    //         // check the dish (frontend)
    //         setDishesChecked([...dishesChecked, event.target.value])
    //         // add the dish (backend)
    //         handleAddDish(event.target.value);
    //     } else {
    //         // uncheck the dish (frontend)
    //         const newDishesChecked = dishesChecked.filter((dish) => dish !== event.target.value);
    //         setDishesChecked(newDishesChecked);
    //         // remove the dish (backend)
    //         handleDelDish(event.target.value);
    //     };
    //     fetchLegit();
    // }

    const [dishesChecked, setDishesChecked] = useState([]);
    const handleDishChecked = (event) => {
        // handle checking a box
        // if (!(dishesChecked.includes(event.target.value))) {
        setMinMax();
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

    // after validation poe
    // const [dishesChecked, setDishesChecked] = useState([]);
    // const handleDishChecked = (event) => {
    //     const {value, checked} = event.target
    //     // Check the box to add
    //     if (checked && !(dishesChecked.includes(value))) {
    //         // check the dish (frontend)
    //         setDishesChecked([...dishesChecked, value])
    //         // add the dish (backend)
    //         handleAddDish(value);
    //     // Uncheck the box to remove
    //     } else {
    //         // uncheck the dish (frontend)
    //         const newDishesChecked = dishesChecked.filter((dish) => dish !== value);
    //         setDishesChecked(newDishesChecked);
    //         // remove the dish (backend)
    //         handleDelDish(value);
    //     };

    //     fetchLegit();
    // }

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
    // const [isLegit, setIsLegit] = useState("No");
    // const fetchLegit = async () => {
    //     const response = await api.get("/legit");
    //     setIsLegit(response.data);                
    // };
    // useEffect(() => {
    //     fetchLegit();
    // }, []);

    // const [isLegit, setIsLegit] = useState("否");
    const [isLegit, setIsLegit] = useState("");
    const fetchLegit = async () => {
        const response = await api.get("/legit");
        setIsLegit(response.data);
    };
    // useEffect not needed, default 否 already? less accurate as will be default value but not from backend
    useEffect(() => {
        fetchLegit();
    }, []);

    // Error message when too little/many dishes are checked
    const [errorMessage, setErrorMessage] = useState("")

    // Add checked dishes - backend
    const handleSubmit = () => {
        // fetchLegit();
        // Go to checkout page if order is legit
        // if (isLegit === "是") {
        //     navigate("/checkout");
        // // reset order if order is not legit
        // } else {
        //     api.post("/reset");
        //     navigate("/");
        // };

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
                    <h6>套餐: {stdMealSet ? "普通餐" : "蒸魚餐"}</h6>                    
                    <div>
                        <input type="checkbox" onChange={handleFishMeal} />
                        <span> 轉蒸魚餐</span>
                    </div>
                    <br />
                    {/* <h6>餸</h6> */}
                    <div>{stdMealSet ? Constants.infoStdMeal1 : Constants.infoFishMeal1}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal2 : Constants.infoFishMeal2}</div>
                    <div>{stdMealSet ? Constants.infoStdMeal3 : Constants.infoFishMeal3}</div>
                    <br />

                    {/* <div>
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
                    </div> */}
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
                    
                    {/* debug */}
                    <p>Legit: {isLegit} Std: {stdMealSet ? "是" : "否"}</p>
                    <p>range: {minToCheck}-{maxToCheck}</p>

                    {/* <p style={{ color: 'red' }}>{dishesChecked.length < minToCheck ? "請最少選" + minToCheck + "個餸" : ""}</p>
                    <p style={{ color: 'red' }}>{dishesChecked.length > maxToCheck ? "最多可選" + maxToCheck + "個餸" : ""}</p> */}
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                    
                    <button onClick={handleSubmit} class="btn btn-primary" style={{ marginRight: '7.5px' }}>確認</button>
                    <button onClick={handleCancel} class="btn btn-outline-primary">取消</button>

                </div>
            </div>
        </div>
    );
};

export default Menu;
