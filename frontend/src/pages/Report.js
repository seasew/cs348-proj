import { useState } from "react";
const Report = () => {
    // variables for displaying the report
    const [logs, setLogs] = useState([]);                   // the filtered logs
    const [majorityMood, setMajorityMood] = useState([]);   // array of majority mood objects
    const [averageColor, setAverageColor] = useState("");   // average color of the logs

    const [formData, setFormData] = useState({
        from_date: "01/01/2025",
        to_date: "12/31/2025",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_PROXY}/api/report`, {
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
            setLogs(data.logs); // set the filtered logs
            setMajorityMood(data.majority_mood); // set the majority mood object
            setAverageColor(data.average_color); // set the average color

            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Report Page</h2>
            <p>Select an inclusive date range.</p>
            <p>The report will display all matching logs, the majority mood over that date range, number of logs made, and the average mood color.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <label htmlFor="from_date">From (mm/dd/yyyy):</label>
                <input type="text" id="from_date" name="from_date" defaultValue={"01/01/2025"} onChange={handleChange} />
                <br />
                <label htmlFor="to_date">To (mm/dd/yyyy):</label>
                <input type="text" id="to_date" name="to_date" defaultValue={"12/31/2025"} onChange={handleChange} />
                <br />
                <button type="submit">Submit</button>
            </form>
            <br />
            <h2>Report</h2>
            {logs.length ?
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontWeight: "bold" }}>Majority Mood(s):</p>
                    {majorityMood.map((mood, index) => (
                        <li key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <p>{mood.title}</p>
                            <p style={{ fontSize: "40px", margin: "0px", color: mood.hex_code }}>&#9679;</p>
                        </li>
                    ))}
                    <p><span style={{ fontWeight: "bold" }}>Number of Logs: </span>{logs.length}</p>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                        <p style={{ fontWeight: "bold" }}>Average Color:</p>
                        <p style={{ fontSize: "40px", margin: "0px", color: averageColor }}>&#9679;</p>
                    </div>
                    <p style={{ fontWeight: "bold"}}>Matching Logs:</p>
                    <table style={{ border: "1px solid" }}>
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
                </div>
                : <p>Nothing to display.</p>}
        </div>
    );
};

export default Report;