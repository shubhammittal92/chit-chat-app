import { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { FaMapMarkerAlt, FaPaperclip } from "react-icons/fa"; // Import the attachment icon
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const fileInputRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	const handleSendLocation = () => {
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by your browser");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
				await sendMessage(locationMessage);
			},
			(error) => {
				alert("Unable to retrieve your location");
				console.error(error);
			}
		);
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			// Logic to handle file upload and sending the file message
			const fileMessage = `Attached file: ${file.name}`;
			await sendMessage(fileMessage);
		}
	};

	const handleAttachmentClick = () => {
		fileInputRef.current.click();
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div className='absolute inset-y-0 end-0 flex items-center space-x-2 pe-3'>
					<button type='button' onClick={handleAttachmentClick} className='text-white'>
						<FaPaperclip />
					</button>
					<button type='button' onClick={handleSendLocation} className='text-white'>
						<FaMapMarkerAlt />
					</button>
					<button type='submit' className='text-white'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>
				<input
					type='file'
					ref={fileInputRef}
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
			</div>
		</form>
	);
};

export default MessageInput;
