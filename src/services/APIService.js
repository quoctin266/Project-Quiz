import axios from "../utils/axiosCustomize";

const postCreateNewUser = (username, password, email, role, image) => {
  const data = new FormData();
  data.append("username", username);
  data.append("password", password);
  data.append("email", email);
  data.append("role", role);
  data.append("userImage", image);

  return axios.post("api/v1/participant", data);
};

const getAllUser = () => {
  return axios.get("api/v1/participant/all");
};

const putUpdateUser = (id, username, role, image) => {
  const data = new FormData();
  data.append("id", id);
  data.append("username", username);
  data.append("role", role);
  data.append("userImage", image);

  return axios.put("api/v1/participant", data);
};

const deleteUser = (userId) => {
  return axios.delete("api/v1/participant", {
    data: { id: userId },
  });
};

const getUserPaginate = (page, limit) => {
  return axios.get(`api/v1/participant?page=${page}&limit=${limit}`);
};

const postLogin = (email, password) => {
  return axios.post(`api/v1/login`, {
    email: email,
    password: password,
    delay: 3000,
  });
};

const postRegister = (email, password, username) => {
  return axios.post(`api/v1/register`, {
    email: email,
    password: password,
    username: username,
  });
};

const getQuizByUser = () => {
  return axios.get("api/v1/quiz-by-participant");
};

const getDataQuiz = (id) => {
  return axios.get(`api/v1/questions-by-quiz?quizId=${id}`);
};

const postSubmitQuiz = (data) => {
  return axios.post(`api/v1/quiz-submit`, data);
};

const postCreateQuiz = (description, name, difficulty, image) => {
  const data = new FormData();
  data.append("description", description);
  data.append("name", name);
  data.append("difficulty", difficulty);
  data.append("quizImage", image);

  return axios.post("api/v1/quiz", data);
};

const getAllQuizAdmin = () => {
  return axios.get(`api/v1/quiz/all`);
};

const putUpdateQuiz = (id, description, name, difficulty, quizImage) => {
  const data = new FormData();
  data.append("id", id);
  data.append("description", description);
  data.append("name", name);
  data.append("difficulty", difficulty);
  data.append("quizImage", quizImage);

  return axios.put("api/v1/quiz", data);
};

const deleteQuiz = (quizId) => {
  return axios.delete(`api/v1/quiz/${quizId}`);
};

const postCreateQuestion = (quizId, description, image) => {
  const data = new FormData();
  data.append("quiz_id", quizId);
  data.append("description", description);
  data.append("questionImage", image);

  return axios.post("api/v1/question", data);
};

const postCreateAnswer = (questionId, description, correctAnswer) => {
  return axios.post(`api/v1/answer`, {
    description: description,
    correct_answer: correctAnswer,
    question_id: questionId,
  });
};

const postAssignQuiz = (quizId, userId) => {
  return axios.post(`api/v1/quiz-assign-to-user`, {
    quizId: quizId,
    userId: userId,
  });
};

const getQuizWithQA = (quizId) => {
  return axios.get(`api/v1/quiz-with-qa/${quizId}`);
};

const postUpsertQA = (data) => {
  return axios.post(`api/v1/quiz-upsert-qa`, {
    ...data,
  });
};

const postLogOut = (email, refresh_token) => {
  return axios.post(`api/v1/logout`, {
    email: email,
    refresh_token: refresh_token,
  });
};

export {
  postCreateNewUser,
  getAllUser,
  putUpdateUser,
  deleteUser,
  getUserPaginate,
  postLogin,
  postRegister,
  getQuizByUser,
  getDataQuiz,
  postSubmitQuiz,
  postCreateQuiz,
  getAllQuizAdmin,
  putUpdateQuiz,
  deleteQuiz,
  postCreateQuestion,
  postCreateAnswer,
  postAssignQuiz,
  getQuizWithQA,
  postUpsertQA,
  postLogOut,
};
