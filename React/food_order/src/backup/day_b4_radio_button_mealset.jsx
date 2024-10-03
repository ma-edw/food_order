import React from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "../constants/constants"


const Day = () => {
    const navigate = useNavigate();

    const goToMenu = () => {
        navigate("/menu");
    };

    return (
        <div class="col d-flex justify-content-center">
            <div class="card" style={{ minWidth: '300px' }}>
                <div class="card-body">
                    <h5>兩餸飯</h5>
                    <br />
                    <p>套餐</p>
                    <ul>
                        <li>可揀普通餐/蒸魚餐</li>
                        <li>普通餐${Constants.set_std_price}，包2個餸</li>
                        <li>蒸魚餐${Constants.set_fish_price}，包蒸倉魚加1個餸</li>
                        <li>套餐最多可再加2個餸，每加1個餸加${Constants.extra_dish_price}</li>
                    </ul>
                    <p>附加</p>
                    <ul>
                        <li>可加小食 ${Constants.sidedish_price}</li>
                        <li>可加特飲 ${Constants.drink_price}</li>
                    </ul>
                    <button onClick={goToMenu} class="btn btn-primary" >點餐</button>
                </div>
            </div>
        </div>
    );

};

export default Day;