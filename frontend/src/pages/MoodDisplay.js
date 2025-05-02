import { useState, useEffect } from 'react';

const MoodDisplay = () => {
    // Retrieve all moods from the server
    // and display them in a list format

    const [moods, setMoods] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_PROXY}/api/moods`)
            .then(response => response.json())
            .then(data => setMoods(data));
    }, [setMoods]);

    const [formData, setFormData] = useState({
        title: "",
        hex_code: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_PROXY}/api/insert-mood`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Mood Display</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <label htmlFor="date">Title:</label>
                <input type="text" id="date" name="title" onChange={handleChange} />
                <br />
                <label htmlFor="mood">Hex Code #RRGGBB:</label>
                <input type="text" id="mood" name="hex_code" onChange={handleChange} />
                <br />
                <button type="submit">+ Insert new entry</button>
            </form>
            {
                moods.length > 0 ? (
                    <ul>
                        {moods.map((mood, index) => (
                            <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                                <p>{mood.id}</p>
                                <p>{mood.title}</p>
                                <p style={{ fontSize: "40px", margin: "0px", color: mood.hex_code }}>&#9679;</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No moods available</p>
                )
            }
        </div>
    );
};

export default MoodDisplay;