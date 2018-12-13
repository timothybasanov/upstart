import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      users: []
    };
    this.reload = this.reload.bind(this);
    this.remove = this.remove.bind(this);
  }


  componentDidMount() {
    this.reload()
        .then(() => {
          console.debug('Reloaded after a component mount')
        })
  }

  async reload() {
    this.setState({...this.state, isLoading: true});
    console.debug("Reloading users...");
    const response = await fetch('/api/users');
    const body = await response.json();
    this.setState({users: body._embedded.users, isLoading: false});
  }

  async remove(id) {
    console.debug('Deleting user...', id);
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedUsers = [...this.state.users].filter(i => i.id !== id);
      this.setState({users: updatedUsers});
    }).then(() => this.reload().then(() => console.debug('Reloaded after a delete')))
  }

  render() {
    const {users, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
        <div className="App">
          <header className="App-header">
            <div className="App-intro">
              <h2>Users list</h2>
              {users.map(user => (
                  <div key={user.id}>
                    {user.id}: {user.email}
                    <button onClick={() => this.remove(user.id)}>Delete</button>
                  </div>
              ))}
            </div>
            <NewUserForm onAdd={user => {
              this.setState({...this.state, users: [...this.state.users, user]});
              this.reload().then(() => console.debug('Reloaded after add'));
            }}/>
          </header>
        </div>
    );
  }
}

class NewUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {email: ''}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    let user = {...this.state.user};
    user[name] = value;
    this.setState({user});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {user} = this.state;
    this.setState({user: {email: ''}});

    console.debug('Adding user...', user);
    await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    });
    this.props.onAdd(user);
  }

  render() {
    return (
        <div>
          <input type="text" name="email" onChange={this.handleChange}/>
          <button onClick={(e) => this.handleSubmit(e)}>Create</button>
        </div>
    )
  }
}

export default App;
