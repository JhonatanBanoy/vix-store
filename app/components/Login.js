import React, {useState} from "react";
import { api } from "../../lib/api";
import { useRouter } from 'next/navigation';

const Login = ({setToken}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // State for error message
    const router = useRouter();

    const handlelogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await api.post("/auth/login", {email, password});
            const token = response.data.token;
            setToken(token); // Guardar el token en el estado global
            localStorage.setItem("token", token); // Guardar el token en el localStorage
            router.push('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            setError("Credenciales incorrectas");
        }
    }
    

    //TODO: Crear el componente de registro -> return y al HTML
return (
    <div>
        <h2>Iniciar sesion Admin</h2>
        <form onSubmit={handlelogin}>
            {/*Input for email*/}
            <div>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

            {/*Input for password*/}
                <div>
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                {/*Button to submite the form*/}

                <button type="submit">Login</button>
        </form>
    </div>
);
};

export default Login;