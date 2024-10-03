import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


const Day = () => {
    const navigate = useNavigate();

    // Meal sets - backend
    const [mealSets, setMenlSets] = useState([]);
    const fetchMealSets = async () => {
        const response = await api.get("/meal_sets");
        setMenlSets(response.data);
    };
    useEffect(() => {
        fetchMealSets();
    }, []);

    // Day to change into
    const [dayToChange, setDayToChange] = useState(1);
    const handleSetDayToChange = (event) => {
        setDayToChange(event.target.value);
    };
    const handleDayChange = () => {
        api.post(`/day/${dayToChange}`);
        navigate("/menu");
    };

    return (
        // <div class="row g-3">
        <div class="row g-3 d-flex justify-content-center">
            {/* <div class="row g-3 row-cols-3 d-flex justify-content-center"> */}
            <div class="row g-3 row-cols-3 d-flex">
                {mealSets.map((mealSet, index) => (
                    <div class="col">
                        <div class="card">
                            {/* <img src="https://mdbcdn.b-cdn.net/img/new/standard/city/041.webp" class="card-img-top"
                            alt="Hollywood Sign on The Hill" /> */}
                            <div class="card-body">
                                <table>
                                    <th>Set {index + 1}</th>
                                    <tr>
                                        <table>
                                            {mealSet.map((dish) => (
                                                <tr>
                                                    <td>{dish}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </tr>
                                </table>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div class="row g-3 row-cols-3 d-flex justify-content-center">
                <div class="card" style={{ minWidth: '250px' }}>
                    <div class="card-body">
                        <h5>Choose Meal Set</h5>
                        <table>
                            <tr>
                                <td>
                                    <form onSubmit={handleDayChange}>
                                        <select onChange={handleSetDayToChange}>
                                            <option value="1" selected>Set 1</option>
                                            <option value="2">Set 2</option>
                                            <option value="3">Set 3</option>
                                            <option value="4">Set 4</option>
                                            <option value="5">Set 5</option>
                                        </select>
                                        <br />
                                        <br />
                                        <input type="submit" class="btn btn-primary" value="Confirm" />
                                    </form>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            
        </div>
    );

};

export default Day;