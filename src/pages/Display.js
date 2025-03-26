import { useState, useEffect } from 'react';

const Display = () => {
    // Retrieve all logs from the server
    // and display them in a list format

    const [logs, setLogs] = useState([]);
    const [moods, setMoods] = useState([]);

    useEffect(() => {
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => setLogs(data));
    }, [setLogs]);

    useEffect(() => {
        fetch('/api/moods')
            .then(response => response.json())
            .then(data => setMoods(data));
    }, [setMoods]);


    const [formData, setFormData] = useState({
        date: "",
        mood_id: 0,
        note: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/insert-log', {
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
            <h2>Tracker Display</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <label htmlFor="date">Date (mm/dd/yyyy):</label>
                <input type="text" id="date" name="date" onChange={handleChange} />
                <br />
                <label htmlFor="mood">Mood:</label>
                <select id="mood_id" name="mood_id" width="100px" onChange={handleChange}>
                    <option disabled selected value> -- select an option -- </option>
                    {moods ?
                        moods.map((mood, index) => (
                            <option key={index} value={mood.id} style={{ color: mood.hex_code }}>
                                {mood.title}&#9679;
                            </option>
                        )) : <></>}
                </select>
                <br />
                <label htmlFor="note">Note:</label>
                <input type="text" id="note" name="note" onChange={handleChange} />
                <br />
                <button type="submit">+ Insert new entry</button>
            </form>
            <br />
            {
                logs.length > 0 ? (
                    <table style={{ border: "1px solid", width:"100%" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid" }}>ID</th>
                                <th style={{ border: "1px solid" }}>Date</th>
                                <th style={{ border: "1px solid" }}>Mood</th>
                                <th style={{ border: "1px solid" }}>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index} >
                                    <td style={{ border: "1px solid" }}>{log.id}</td>
                                    <td style={{ border: "1px solid" }}>{log.date}</td>
                                    <td style={{ display: "flex", flexDirection: "row", alignItems: "center", border: "1px solid" }}>
                                        <p>{log.mood}</p>
                                        <p style={{ fontSize: "40px", margin: "0px", color: log.mood_hex_code }}>&#9679;</p>
                                    </td>
                                    <td style={{ border: "1px solid" }}>{log.note ? log.note : ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No logs available</p>
                )
            }
        </div>
    );
};

export default Display;