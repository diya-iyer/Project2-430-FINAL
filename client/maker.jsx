const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Handle form submission to create a new Domo
const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;

    if (!name || !age || !level) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, level }, onDomoAdded);
    return false;
};

// Domo creation form component
const DomoForm = (props) => {
    return (
        <form
            id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <div className="formRow">
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            </div>
            <div className="formRow">
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="number" min="0" name="age" />
            </div>
            <div className="formRow">
                <label htmlFor="level">Level: </label>
                <input id="domoLevel" type="number" min="1" name="level" placeholder="Domo Level" />
            </div>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

// Domo list component with `level` and styled delete button
const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const handleDeleteDomo = async (domoId) => {
        try {
            await helper.sendPost('/deleteDomo', { id: domoId });
            props.triggerReload();
        } catch (error) {
            console.error(error);
        }
    };

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map((domo) => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <button
                    className="deleteDomoButton"
                    onClick={() => handleDeleteDomo(domo._id)}
                >
                    Delete
                </button>
            </div>
        );
    });

    return <div className="domoList">{domoNodes}</div>;
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

// Initialize the React app
const init = () => {
    const root = createRoot(document.querySelector('#app'));
    root.render(<App />);
};

window.onload = init;
