const AuthContextProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const navigate = useNavigate()

  async function handleRegister(formData,email) {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/account/register/`, formData);
      localStorage.setItem("tokens", JSON.stringify(res.data));
      localStorage.setItem("email", email);
      navigate("/");
    } catch (error) {
      setError(Object.values(error.response.data));
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLogin(formData, email) {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/account/login/`, formData);
      // console.log(res);
      localStorage.setItem("tokens", JSON.stringify(res.data));
      localStorage.setItem("email", email);
      setCurrentUser(email);
      navigate("/");
    } catch (error) {
      setError(Object.values(error.response.data));
    } finally {
      setLoading(false);
    }
  }

  async function checkAuth() {
    try {
      setLoading(true);
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const res = await axios.post(`${API}/account/logout/`, {
        refresh_token: tokens.refresh,
        title: "Refresh token",
      });
      localStorage.setItem(
        "tokens",
        JSON.stringify({ access: res.data.access, refresh: tokens.refresh })
      );
      const email = localStorage.getItem("email");
      setCurrentUser(email);
  
      console.log("Обновленный токен:", res.data.access);
    } catch (error) {
      console.log(error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }
  
  

  function handleLogout() {
    localStorage.removeItem("tokens");
    localStorage.removeItem("email");
    setCurrentUser(null);
    navigate("/");
  }

  async function resetPassword (email) {
    try {
      setLoading(true);
      await axios.post(`${API}/account/password-reset/`,{email} );
      console.log(email);
    } catch (error) {
      console.log(error);
    }
  }


  // async function changePassword() {
  //   try {
  //     const tokens = JSON.parse(localStorage.getItem("tokens"));
  //     const response = await axios.post(`${API}/account/change_password/`, {
  //       current_password: currentPassword,
  //       new_password: newPassword,
  //       confirm_password: confirmPassword
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${tokens.access}`
  //       }
  //     });
  //     console.log(response.data);

  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // }

  async function refreshToken() {
    try {
      setLoading(true);
      const tokens = JSON.parse(localStorage.getItem("tokens"));
  
      // Запрос на обновление токена
      const refreshResponse = await axios.post(`${API}/account/refresh_token/`, {
        refresh_token: tokens.refresh,
      });
  
      // Обновление токена в локальном хранилище
      localStorage.setItem(
        "tokens",
        JSON.stringify({ access: refreshResponse.data.access, refresh: tokens.refresh })
      );
  
      console.log("Обновленный токен:", refreshResponse.data.access);
  
      // Возврат обновленного токена
      return refreshResponse.data.access;
    } catch (error) {
      console.log(error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  async function changePassword() {
    try {
      setLoading(true);
      const refreshedToken = await refreshToken();
      const response = await axios.post(`${API}/account/change_password/`, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${refreshedToken}`
        }
      });
  
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  
  

  const values = {
    handleRegister,
    loading,
    error,
    setError,
    currentUser,
    handleLogin,
    checkAuth,
    handleLogout,
    setCurrentUser,
    resetPassword,
    changePassword,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,refreshToken
  };
  return (
    <authContext.Provider value={values}>{children}</authContext.Provider>
  )
}

export default AuthContextProvider