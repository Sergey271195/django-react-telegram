import React from 'react';

class WebsocketHandler extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            ws: null,
        }

        this.connect = this.connect.bind(this)

    }
    
    componentDidMount() {
        this.connect();
    }

    componentWillUnmount() {
        this.state.ws.close();
        this.setState({ws: null})
    }


    connect() {

        let ws = new WebSocket('ws://localhost:8765/api');

        ws.onopen = () => {
            console.log('Opened')
            this.setState({ws: ws})
        }

        ws.onclose = (e) => {
            console.log('closed', e)
        }

        ws.onerror = (e) => {
            console.log('error', e.message)
        }

        ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            this.props.setMessage(data)
          };
    }
    
    render() {
        return <div></div>
    }

}

export default WebsocketHandler