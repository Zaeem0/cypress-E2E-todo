import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { saveTodo, loadTodos, destroyTodo, updateTodo } from "../lib/service";
import { filterTodos } from "../lib/utils";
export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
      error: false
    };

    this.handleTodoChange = this.handleTodoChange.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
    this.handleDestroyTodo = this.handleDestroyTodo.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(() => this.setState({ error: true }));
  }

  handleTodoChange(e) {
    this.setState({
      currentTodo: e.target.value
    });
  }

  handleTodoSubmit(e) {
    e.preventDefault();
    const newTodo = { name: this.state.currentTodo, isComplete: false };
    saveTodo(newTodo)
      .then(({ data }) =>
        this.setState({
          todos: this.state.todos.concat(data),
          currentTodo: ""
        })
      )
      .catch(() => this.setState({ error: true }));
  }

  handleDestroyTodo(id) {
    destroyTodo(id).then(() =>
      this.setState({ todos: this.state.todos.filter(t => t.id !== id) })
    );
  }

  handleToggle(id) {
    console.log("toggling", id);
    const targetTodo = this.state.todos.find(t => t.id === id);
    const updated = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    };
    updateTodo(updated).then(({ data }) => {
      const todos = this.state.todos.map(t => (t.id === data.id ? data : t));
      this.setState({ todos });
    });
  }

  render() {
    const remaining = this.state.todos.filter(t => !t.isComplete).length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error && <span className="error">YIKES!</span>}
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleTodoChange={this.handleTodoChange}
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  todos={filterTodos(match.params.filter, this.state.todos)}
                  handleDestroyTodo={this.handleDestroyTodo}
                  handleToggle={this.handleToggle}
                />
              )}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
