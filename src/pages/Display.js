import { useState, useEffect } from 'react';

const Display = () => {
    // Retrieve all logs from the server
    // and display them in a list format

    // Store logs and moods
    const [logs, setLogs] = useState([]);
    const [moods, setMoods] = useState([]);
    const [refreshLogs, setRefreshLogs] = useState(false);

    // Fetch all logs
    useEffect(() => {
        fetchLogs();
    }, [setLogs, refreshLogs]);

    const fetchLogs = async () => {
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => {
                setLogs(data.map(log => ({ ...log, isEditing: false, editFormData: { date: log.date, mood_id: log.mood_id, note: log.note } })));
            });
    };

    // Fetch moods
    useEffect(() => {
        fetch('/api/moods')
            .then(response => response.json())
            .then(data => setMoods(data));
    }, [setMoods]);


    // Store form data enabling using to insert a new log
    const [formData, setFormData] = useState({
        date: "",
        mood_id: 0,
        note: "",
    });

    // Handle when insert form data changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle when user submits the form to insert a new log
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

    // Handle when the user saves a change during edit
    const handleSave = async (logId) => {
        try {
            let editedLogData = logs.find((log) => log.id === logId).editFormData;
            console.log(editedLogData);

            const response = await fetch(`/api/update-log/${logId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedLogData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }

        // Disable the editing mode after saving
        setLogs(logs.map(log =>
            log.id === logId ? { ...log, isEditing: false } : log
        ));

        setRefreshLogs(!refreshLogs);
    };

    // Handle when the user cancels a change during edit
    const handleCancel = async (logId) => {
        setLogs(logs.map(log =>
            log.id === logId ? { ...log, isEditing: false } : log
        ));
    }

    // Handle when the user clicks the edit button
    const handleEdit = async (logId) => {
        setLogs(logs.map(log =>
            log.id === logId ? { ...log, isEditing: true } : log
        ));
    }

    const handleDelete = async (logId) => {
        try {
            const response = await fetch(`/api/delete-log/${logId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }

        setRefreshLogs(!refreshLogs); // Trigger a refresh of logs
    }

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
                    <table style={{ border: "1px solid", width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid", width: "10%" }}>ID</th>
                                <th style={{ border: "1px solid", width: "15%" }}>Date</th>
                                <th style={{ border: "1px solid" }}>Mood</th>
                                <th style={{ border: "1px solid", width: "20%" }}>Note</th>
                                <th style={{ border: "1px solid", width: "10%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index} style={{}}>
                                    {
                                        log.isEditing ? (
                                            <>
                                                <td style={{ border: "1px solid", height: "50px" }}>{log.id}</td>
                                                <td style={{ border: "1px solid", height: "50px" }}>
                                                    <input
                                                        type="text"
                                                        name="date"
                                                        value={log.editFormData.date}
                                                        onChange={(e) => {
                                                            const updatedLogs = logs.map(l =>
                                                                l.id === log.id ? { ...l, editFormData: { ...l.editFormData, date: e.target.value } } : l
                                                            );
                                                            setLogs(updatedLogs);
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid", height: "50px" }}>
                                                    <select
                                                        name="mood_id"
                                                        value={log.editFormData.mood_id}
                                                        onChange={(e) => {
                                                            const updatedLogs = logs.map(l =>
                                                                l.id === log.id ? { ...l, editFormData: { ...l.editFormData, mood_id: e.target.value } } : l
                                                            );
                                                            setLogs(updatedLogs);
                                                        }}
                                                    >
                                                        {moods.map((mood, index) => (
                                                            <option key={index} value={mood.id} style={{ color: mood.hex_code }}>
                                                                {mood.title}&#9679;
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ border: "1px solid", height: "50px" }}>
                                                    <input
                                                        type="text"
                                                        name="note"
                                                        value={log.editFormData.note}
                                                        onChange={(e) => {
                                                            const updatedLogs = logs.map(l =>
                                                                l.id === log.id ? { ...l, editFormData: { ...l.editFormData, note: e.target.value } } : l
                                                            );
                                                            setLogs(updatedLogs);
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid", height: "50px" }}>
                                                    <button onClick={() => handleDelete(log.id)}>Delete</button>
                                                    <button onClick={() => handleSave(log.id)}>Save</button>
                                                    <button onClick={() => handleCancel(log.id)}>Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ border: "1px solid" }}>{log.id}</td>
                                                <td style={{ border: "1px solid" }}>{log.date}</td>
                                                <td style={{ display: "flex", flexDirection: "row", alignItems: "center", border: "1px solid" }}>
                                                    <p>{log.mood}</p>
                                                    <p style={{ fontSize: "40px", margin: "0px", color: log.mood_hex_code }}>&#9679;</p>
                                                </td>
                                                <td style={{ border: "1px solid" }}>{log.note ? log.note : ""}</td>
                                                <td style={{ border: "1px solid", width: "120px" }}>
                                                    <button onClick={() => handleDelete(log.id)}>Delete</button>
                                                    <button onClick={() => handleEdit(log.id)}>Edit</button>
                                                </td>
                                            </>
                                        )
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No logs available</p>
                )
            }
        </div >
    );
};

export default Display;