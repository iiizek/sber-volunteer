import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		// В реальном приложении здесь будет настоящая авторизация с GraphQL
		try {
			// Симуляция входа
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (username === 'admin' && password === 'admin') {
				navigate('/admin');
			} else if (username === 'organizer' && password === 'organizer') {
				navigate('/organizer');
			} else if (username === 'volunteer' && password === 'volunteer') {
				navigate('/volunteer');
			} else {
				setError('Неверное имя пользователя или пароль');
			}
		} catch (err) {
			setError('Произошла ошибка при входе');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen'>
			<div className='space-y-8 w-full max-w-md'>
				<div>
					<h2 className='mt-6 font-extrabold text-gray-900 text-3xl text-center'>
						Вход в систему
					</h2>
					<p className='mt-2 text-gray-600 text-sm text-center'>
						Введите ваши учетные данные
					</p>
				</div>

				<form className='space-y-6 mt-8' onSubmit={handleSubmit}>
					<div className='-space-y-px shadow-sm rounded-md'>
						<div>
							<label htmlFor='username' className='sr-only'>
								Имя пользователя
							</label>
							<div className='relative'>
								<div className='left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none'>
									<User className='w-5 h-5 text-gray-400' />
								</div>
								<input
									id='username'
									name='username'
									type='text'
									autoComplete='username'
									required
									className='block focus:z-10 relative px-3 py-2 pl-10 border border-gray-300 focus:border-indigo-500 rounded-none rounded-t-md focus:outline-none focus:ring-indigo-500 w-full text-gray-900 sm:text-sm appearance-none placeholder-gray-500'
									placeholder='Имя пользователя'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label htmlFor='password' className='sr-only'>
								Пароль
							</label>
							<div className='relative'>
								<div className='left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none'>
									<Key className='w-5 h-5 text-gray-400' />
								</div>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className='block focus:z-10 relative px-3 py-2 pl-10 border border-gray-300 focus:border-indigo-500 rounded-none rounded-b-md focus:outline-none focus:ring-indigo-500 w-full text-gray-900 sm:text-sm appearance-none placeholder-gray-500'
									placeholder='Пароль'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
					</div>

					{error && (
						<div className='bg-red-50 p-4 rounded-md'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<AlertCircle className='w-5 h-5 text-red-400' />
								</div>
								<div className='ml-3'>
									<h3 className='font-medium text-red-800 text-sm'>{error}</h3>
								</div>
							</div>
						</div>
					)}

					<div>
						<button
							type='submit'
							disabled={loading}
							className='group relative flex justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-medium text-white text-sm'
						>
							{loading ? 'Загрузка...' : 'Войти'}
						</button>
					</div>

					<div className='text-sm text-center'>
						<div className='mb-2 font-medium text-indigo-600'>
							Демо аккаунты:
						</div>
						<div className='text-gray-500'>
							<div>admin / admin - Администратор</div>
							<div>organizer / organizer - Организатор</div>
							<div>volunteer / volunteer - Волонтер</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
