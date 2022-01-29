import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { If, Then, Else } from 'react-if-elseif-else-render';
import '../style/App.css';
import '../style/Question.css';
import { fbUsers, fbUserAnswers } from '../firebase/service';
import { statusCheck, statusQuestion } from '../images/images';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      show: true,
      selected: null,
      disabled: true,
      incomplete: true,
      hint: false,
      hintText: null,
      hintType: null,

      selectedAnswers: null
    };
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
    this.loadModalData();
  }

  componentDidUpdate(prevProps, prevState) { // do not remove prevProps!
    if (prevState) {
      if (prevState.show === false && this.state.show === false) {
        this.loadModalData();
      }
    }
  }

  loadModalData() {
    this.setState({ loaded: false, show: true, selected: null, disabled: true, incomplete: true, hint: false, selectedAnswers: null }, () => {
      this.loadPreviousAnswers();
    })
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleChange = (e) => {
    this.setState({ selected: e.target.value });

    // Disable submit button if nothing selected
    if (e.target.value !== null) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }

  async loadPreviousAnswers() {
    const previousAnswers = await fbUserAnswers.getUserQuestion(this.props.userId, this.props.id);
    if (previousAnswers.length > 0) {
      this.setState({ selectedAnswers: previousAnswers });
      previousAnswers.forEach((a) => {
        // Uses timeout so Modal does not flicker when loading too fast.
        setTimeout(() => {
          this.setState({ loaded: true })
          let radio = document.getElementById("r" + a);
          if (radio) {
            radio.name = a;
            radio.setAttribute("disabled", true);
            radio.setAttribute("checked", true);
            if (parseInt(a) === this.props.correctAnswer) {
              radio.classList.add('correct');
              this.disableQuestion();
            }
            else {
              radio.classList.add('incorrect');
            }
          }
        }, 300)
      })
    }
    else {
      this.setState({ selectedAnswers: [] });
      // Uses timeout so Modal does not flicker when loading too fast.
      setTimeout(() => this.setState({ loaded: true, incomplete: true }), 300);
    }
  }

  disableQuestion() {
    for (var i = 0; i < this.props.answers.length; i++) {
      let radio = document.getElementById("r" + i);
      if (radio) {
        radio.setAttribute("disabled", true);
      }
    }
    this.setState({ incomplete: false });
  }

  async submit() {
    this.setState({ hint: false, hintType: null, hintText: null,
      disabled: true, selected: null });
    if (this.state.selected) {
      if (parseInt(this.state.selected) === this.props.correctAnswer) {
        this.handleCorrect();
      }
      else {
        this.handleIncorrect();
      }
      let newAnswers = this.state.selectedAnswers;
      newAnswers.push(this.state.selected);
      this.setState({ selectedAnswers: newAnswers });
      await fbUserAnswers.updateUserQuestion(this.props.userId, this.props.id, newAnswers);
    }
  }

  async handleCorrect() {
    this.setState({ hint: true, hintType: "primary", hintText: "Well done!" });

    let radio = document.getElementById("r"+this.state.selected);
    radio.name = this.state.selected;
    radio.classList.add('correct');
    radio.setAttribute("disabled", true);

    this.disableQuestion();
    
    const newScore = 
      await fbUsers.updateUserScore(this.props.userId, this.props.scene);

    // Sends reply to parent
    this.props.completedQuestion([this.props.scene, this.props.id, newScore]);
  }

  handleIncorrect() {
    this.setState({ hint: true, hintType: "danger", hintText: this.props.hint });

    let radio = document.getElementById("r"+this.state.selected);
    radio.name = this.state.selected;
    radio.classList.add('incorrect');
    radio.setAttribute("disabled", true);
  }

  render() {
    return (
      <Modal
        centered
        show={this.state.show}
        onHide={this.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <If condition={this.state.loaded === true}>
          <Then>
            <Modal.Header closeButton>
              <If condition={this.state.incomplete === true}>
                <Then><img src={statusQuestion} alt="Question" className="icon"></img></Then>
                <Else><img src={statusCheck} alt="Complete" className="icon"></img></Else>
              </If>
            </Modal.Header>
            <Modal.Body>
              <h5>{this.props.question}</h5>
              {this.props.answers.map((answer, i) => {
                return <Form.Check
                  key={i}
                  id={"r" + i}
                  value={i}
                  type="radio"
                  label={answer}
                  name="formHorizontalRadios"
                  onChange={this.handleChange}
                />
              })}
              <Alert variant={this.state.hintType} show={this.state.hint}>{this.state.hintText}</Alert>
            </Modal.Body>
            <If condition={this.state.incomplete === true}>
              <Then>
                <Modal.Footer id="footer">
                  <Button id="button" variant="primary" onClick={this.submit} disabled={this.state.disabled}>Submit answer</Button>
                </Modal.Footer>
              </Then>
            </If>
          </Then>

          <Else>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ textAlign: "center" }}>
              <Spinner size="sm" animation="border" variant="primary" />
            </Modal.Body>
          </Else>
        </If>
      </Modal>
    );
  }
}

export default Question;