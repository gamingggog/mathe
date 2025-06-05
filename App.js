import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHapticFeedback } from 'react-haptic-feedback';
import * as math from 'mathjs';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const GameContainer = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Question = styled.div`
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }
`;

const Score = styled.div`
  text-align: center;
  font-size: 20px;
  margin: 20px 0;
`;

const CustomQuestionForm = styled.form`
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
`;

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  
  const { trigger } = useHapticFeedback();

  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 26;
        num2 = Math.floor(Math.random() * 25) + 1;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        break;
      case '/':
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
        break;
    }

    const question = `${num1} ${operation} ${num2}`;
    const calculatedAnswer = math.evaluate(question);
    
    setQuestion(question);
    setAnswer(calculatedAnswer);
    setUserAnswer('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userValue = parseFloat(userAnswer);
    const correctValue = parseFloat(answer);

    if (Math.abs(userValue - correctValue) < 0.01) {
      setScore(score + 1);
      setFeedback('Correct! 🎉');
      trigger('success');
    } else {
      setFeedback(`Incorrect. The answer was ${answer}`);
      trigger('error');
    }
  };

  const handleCustomQuestion = (e) => {
    e.preventDefault();
    try {
      const calculatedAnswer = math.evaluate(customQuestion);
      setQuestion(customQuestion);
      setAnswer(calculatedAnswer);
      setCustomQuestion('');
      setCustomAnswer('');
      setUserAnswer('');
      setFeedback('');
    } catch (error) {
      setFeedback('Invalid mathematical expression');
    }
  };

  return (
    <AppContainer>
      <Header>
        <h1>Math Game</h1>
        <Score>Score: {score}</Score>
      </Header>

      <GameContainer>
        <Question>{question}</Question>
        <form onSubmit={handleSubmit}>
          <AnswerInput
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            step="any"
          />
          <div style={{ textAlign: 'center' }}>
            <Button type="submit">Check Answer</Button>
            <Button type="button" onClick={generateQuestion}>New Question</Button>
          </div>
        </form>
        {feedback && <div style={{ textAlign: 'center', margin: '10px 0' }}>{feedback}</div>}

        <CustomQuestionForm onSubmit={handleCustomQuestion}>
          <h3>Add Custom Question</h3>
          <AnswerInput
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Enter mathematical expression (e.g., 2 + 2)"
          />
          <div style={{ textAlign: 'center' }}>
            <Button type="submit">Add Custom Question</Button>
          </div>
        </CustomQuestionForm>
      </GameContainer>
    </AppContainer>
  );
}

export default App; 