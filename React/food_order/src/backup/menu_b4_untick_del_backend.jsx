import React, { useState, useEffect } from "react";
import api from "../api";
// import handleDishChecked from "./App"
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate();

    // Day of the menu - backend
    const [day, setDay] = useState(0);
    const fetchDay = async () => {
        const response = await api.get("/day");
        setDay(response.data);
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

    // Dishes checked - frontend
    const [dishesChecked, setDishesChecked] = useState([]);
    const handleDishChecked = (event) => {
        if (!(dishesChecked.includes(event.target.value))) {
            // add the dish if not added already 
            setDishesChecked([...dishesChecked, event.target.value])
        } else {
            // remove the dish if already included
            const newDishesChecked = dishesChecked.filter((dish) => dish !== event.target.value);
            setDishesChecked(newDishesChecked);
        }
    }

    // Toggle sidedish - backend
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
        dishesChecked.map((dish) => (
            api.post(`/add/${dish}`)
        ));
        // Go to checkout page if order is legit
        fetchLegit();
        if (isLegit === "Yes") {
            navigate("/checkout");
        // reset order if order is not legit
        } else {
            api.post("/reset");
            navigate("/");
        }

        // navigate("/checkout");
    };

    return (        
        <div class="col d-flex justify-content-center">
            <div class="card" style={{ minWidth: '300px' }}>
                <div class="card-body">
                    <h5>Day {day} menu</h5>
                    <br />
                    <h6>Dishes</h6>
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

                    <h6>Add-ons</h6>
                    <div>
                        <input type="checkbox" onChange={handleSidedish} />
                        <span> Sidedish</span>
                    </div>
                    <div>
                        <input type="checkbox" onChange={handleDrink} />
                        <span> Upgrade Drink</span>
                    </div>
                    <br />

                    <button onClick={handleSubmitDishes} class="btn btn-primary" >Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default Menu;
