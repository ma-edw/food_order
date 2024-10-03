import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import * as Constants from "../constants/constants"


const Day = () => {
    const navigate = useNavigate();

    const [mealChoice, setMealChoice] = useState("Std")
    const handleChooseMeal = (event) => {
        setMealChoice(event.target.value);
    };

    const handleGoToMenu = () => {
        // change to fish meal in backend if chosen by user
        if (mealChoice === "Fish") {
            api.post("/fishmeal");
        };
        
        navigate("/menu");
    };

    return (
        <div class="col d-flex justify-content-center">
            <div class="card" style={{ minWidth: '300px' }}>
                <div class="card-body">
                    <h5>兩餸飯</h5>
                    <ul>
                        <li>可選普通餐/蒸魚餐</li>
                        <li>普通餐${Constants.set_std_price}，包2個餸</li>
                        <li>蒸魚餐${Constants.set_fish_price}，包蒸魚再加1個餸</li>
                        <li>套餐最多可再加2個餸，每個餸加${Constants.extra_dish_price}</li>
                        <li>可加小食${Constants.sidedish_price}，和加特飲${Constants.drink_price}</li>
                    </ul>
                    <br />  

                    <p>選擇套餐</p>
                    <form>
                        <label><input type='radio' value="Std" checked={mealChoice === "Std"} onChange={handleChooseMeal} defaultChecked></input> 普通餐</label>
                        <br />
                        <label><input type='radio' value="Fish" checked={mealChoice === "Fish"} onChange={handleChooseMeal}></input> 蒸魚餐</label>                        
                    </form>
                    <br />

                    <button onClick={handleGoToMenu} class="btn btn-primary" >點餐</button>
                </div>
            </div>
        </div>
    );

};

export default Day;