import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate = useNavigate();

    // Fish or Standard meal set - backend
    const [isFishMeal, setisFishMeal] = useState(false)
    const fetchisFishMeal = async () => {
        const response = await api.get("/isfishmeal");
        const isFish = response.data;
        if (isFish === "是") {
            setisFishMeal(true);
        };
    }
    useEffect(() => {
        fetchisFishMeal();
    }, []);

    // Ordered dishes - backend
    const [dishesOrdered, setDishesOrdered] = useState([]);
    const fetchDishesOrdered = async () => {
        const response = await api.get("/dishes");
        setDishesOrdered(response.data);
    };
    useEffect(() => {
        fetchDishesOrdered();
    }, []);

    // sidedish and drink upgrade - backend
    const [addSideDish, setAddSideDish] = useState("")
    const fetchAddSideDish = async () => {
        const response = await api.get("/ifsidedish");
        setAddSideDish(response.data);
    }
    useEffect(() => {
        fetchAddSideDish();
    }, []);

    const [upgradeDrink, setUpgradeDrink] = useState("")
    const fetchUpgradeDrink = async () => {
        const response = await api.get("/ifupgradedrink");
        setUpgradeDrink(response.data);
    }
    useEffect(() => {
        fetchUpgradeDrink();
    }, []);

    // Price - backend
    const [basePrice, setBasePrice] = useState(0);
    const fetchBasePrice = async () => {
        const response = await api.get("/base_price");
        setBasePrice(response.data);
    };
    useEffect(() => {
        fetchBasePrice();
    }, []);

    const [extraDishes, setExtraDishes] = useState(0);
    const fetchExtraDishes = async () => {
        const response = await api.get("/extra_dishes");
        setExtraDishes(response.data);
    };
    useEffect(() => {
        fetchExtraDishes();
    }, []);

    const [extraDishesPrice, setExtraDishesPrice] = useState(0);
    const fetchExtraDishesPrice = async () => {
        const response = await api.get("/extra_dishes_price");
        setExtraDishesPrice(response.data);
    };
    useEffect(() => {
        fetchExtraDishesPrice();
    }, []);

    const [sidedishPrice, setSidedishPrice] = useState(0);
    const fetchSidedishPrice = async () => {
        const response = await api.get("/sidedish_price");
        setSidedishPrice(response.data);
    };
    useEffect(() => {
        fetchSidedishPrice();
    }, []);

    const [drinkPrice, setDrinkPrice] = useState(0);
    const fetchDrinkPrice = async () => {
        const response = await api.get("/drink_price");
        setDrinkPrice(response.data);
    };
    useEffect(() => {
        fetchDrinkPrice();
    }, []);


    const [price, setPrice] = useState(0);
    const fetchPrice = async () => {
        const response = await api.get("/price");
        setPrice(response.data);
    };
    useEffect(() => {
        fetchPrice();
    }, []);

    // Reset - reset order and go back to new order page
    const handleReset = () => {
        api.post("/reset");
        navigate("/");
    };

    return ( 
        <div class="col d-flex justify-content-center">
            <div class="card" style={{ minWidth: '300px' }}>
                <div class="card-body">
                    <h5>訂單</h5>
                    <br />

                    <table>
                        <th>{isFishMeal ? "蒸魚餐" : "普通餐"}</th>
                        {dishesOrdered.map((dish) => (
                            <tr>{dish}</tr>
                        ))}                        
                    </table>
                    <br />

                    <table>
                        <th>價錢</th>
                        <tr>
                            <td>{isFishMeal ? "蒸魚餐" : "普通餐"}</td>
                            <td>${basePrice}</td>
                        </tr>

                        {extraDishes > 0 ?
                            <tr>
                                <td>加{extraDishes}餸</td>
                                <td>${extraDishesPrice}</td>
                            </tr>
                        : ""}
                        
                        {addSideDish === "是" ?
                            <>
                                <hr width="100%" />
                                <tr>
                                    <td>加小食</td>
                                    <td>${sidedishPrice}</td>
                                </tr>
                            </>
                        : ""}
                        
                        {upgradeDrink === "是" ?
                            <>
                                <tr>
                                    <td>加特飲</td>
                                    <td>${drinkPrice}</td>
                                </tr>
                            </>
                        : ""}
                        
                        <br />
                        <tr>
                            <td>合共</td>
                            <td>${price}</td>
                        </tr>
                    </table>
                    <br />
                    <button onClick={handleReset} class="btn btn-primary" >重新下單</button>
                </div>
            </div><div className=""></div>
        </div>
    )

};

export default Checkout;