'use client';
import { useEffect, useState } from "react";
import DateTimePicker from "../../Components/DateTimePicker";
import Swal from "sweetalert2";
import FlightSelect from "./FlightSelect";
import AirlineSelect from "./AirlineSelect";
import { FaSave } from "react-icons/fa";
import { postData } from "@/app/Utils/RequestHandle";

function InsertInad() {
	const months = [
		'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
		'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
	];

	const [fullstartdate, setFullstartdate] = useState('');
	const [fullenddate, setFullenddate] = useState('');
	const [userData, setUserData] = useState();
	const [selectedFlight, setSelectedFlight] = useState("");
	const [selectedAirline, setSelectedAirline] = useState("");
	const [timeok, setTimeok] = useState();
	const [title, setTitle] = useState('');
	const [checkboxdisable, setCheckboxdisable] = useState(false);
	const [remarkval, setRemarkval] = useState('');
	const [surname, setSurname] = useState('');
	const [midname, setMidname] = useState('');
	const [firstname, setFirstname] = useState('');

	const [disableRemark, setDisableRemark] = useState(false);
	const [outbound, setOutbound] = useState('');
	const [outboundflight, setOutboundflight] = useState('');
	const [outbounddate, setOutbounddate] = useState('');
	let tmpmidname =''

	const [startDateTime, setStartDateTime] = useState({
		date: '',
		month: '',
		year: '',
		hour: '',
		minute: ''
	});

	useEffect(()=>{
		setRemarkval(`OUTBOUND ${outbound} ${outboundflight} ON ${outbounddate}`)
	},[outbound,outboundflight,outbounddate])

	const handleCheckbox = () => {
		console.log(remarkval);
		setDisableRemark(!disableRemark);

		setCheckboxdisable(!checkboxdisable);
		if (checkboxdisable === false) {
			setRemarkval('PASSENGER IS ALLOWED')
		} else {
			setRemarkval('')
		}
	};

	const [endDateTime, setEndDateTime] = useState({
		date: '',
		month: '',
		year: '',
		hour: '',
		minute: ''
	});

	useEffect(() => {
		const userData = sessionStorage.getItem('usdt');
		if (userData) {
			setUserData(JSON.parse(userData));
		}
	}, []);

	useEffect(() => {
		if (startDateTime.date) {
			const mindex = months.indexOf(startDateTime.month) + 1;
			const formattedDate = `${startDateTime.year}-${mindex}-${startDateTime.date} ${startDateTime.hour}:${startDateTime.minute}`;
			setFullstartdate(formattedDate);
		}
	}, [startDateTime, months]);

	useEffect(() => {
		if (endDateTime.date) {
			const mindex = months.indexOf(endDateTime.month) + 1;
			const formattedDate = `${endDateTime.year}-${mindex}-${endDateTime.date} ${endDateTime.hour}:${endDateTime.minute}`;
			setFullenddate(formattedDate);
		}
	}, [endDateTime, months]);

	useEffect(() => {
		if (fullstartdate && fullenddate && fullstartdate >= fullenddate) {
			Swal.fire({
				icon: "error",
				title: "ERROR",
				text: "เวลาเริ่มเท่ากับหรือน้อยกว่าสิ้นสุด"
			});
			setTimeok(false);
		} else if (fullstartdate && fullenddate) {
			setTimeok(true);
		}
	}, [fullenddate, fullstartdate]);

	useEffect(() => {
		const initialData = {
			date: '',
			month: '',
			year: '',
			hour: '',
			minute: ''
		};
		setStartDateTime(initialData);
		setEndDateTime(initialData);
	}, []);

	const handleStartDateTimeChange = (newDateTime) => {
		setStartDateTime(newDateTime);
	};

	const handleEndDateTimeChange = (newDateTime) => {
		setEndDateTime(newDateTime);
	};

	const handleAirlineSelect = (selectedValue) => {
		setSelectedAirline(selectedValue);
		console.log("Selected Airline:", selectedValue);
	};

	const handleFlightSelect = (selectedValue) => {
		setSelectedFlight(selectedValue);
	};

	useEffect(() => {
		console.log("Selected Flight:", selectedFlight);
	}, [selectedFlight]);


	const handleSubmit =async (event) => {
		event.preventDefault();
		validateForm()

		const data = {
			timeIn : fullstartdate,
			timeOut : fullenddate,			
			flight: selectedFlight,
			Remark : remarkval.toUpperCase(),
			// firstname : firstname.toUpperCase(),			
			// midname : midname.toUpperCase(),
			passengerName :  surname.toLocaleUpperCase()+'/'+tmpmidname+firstname.toUpperCase()+' '+title.toUpperCase(),
			UserID: userData.EmID
			
		}

		console.log(data);
		const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/new`,data)

	};


	const validateForm = () => {
		
	
		if(!midname){
			tmpmidname =''
		}else{
			 tmpmidname = midname.toLocaleUpperCase()+' '

		}
		if (
			!fullstartdate ||
			!fullenddate ||
			!title ||
			!selectedFlight ||
			!selectedFlight ||
			!remarkval ||
			!firstname ||
			!surname
		) {
			Swal.fire({
				icon: "warning",
				title: "Validation Error",
				text: "Please fill in all the required fields."
			});
			return false;
		}
		return true;
	};


	return (
		<div >
			<form className="flex flex-wrap items-start justify-center text-center md:text-left" onSubmit={handleSubmit}>

				<div className="flex flex-wrap p-1">
					<div>
						<DateTimePicker Label='เริ่มวันที่ / เวลา' initialDateTime={fullstartdate} onDateTimeChange={handleStartDateTimeChange} />
					</div>
					<div>	{startDateTime.date && (

						<DateTimePicker Label='ถึงวันที่ / เวลา' initialDateTime={fullenddate} onDateTimeChange={handleEndDateTimeChange} />

					)}</div>
				</div>
				{timeok && (
					<div>
						<div>ชื่อผู้โดยสาร</div>
						<div>
							<div>
								<label>LastName / Familyname / Surename
									<input 
									type="text" 
									placeholder="LastName / Familyname / Surename" 
									className="uppercase" 
									value={surname} 
									onChange={(e) => setSurname(e.target.value)}
									/>
								</label>
							</div>
							<div>
								<label>Middle Name / Second  Name
									<input type="text" 
									placeholder="Middle Name / Second  Name" 
									className="uppercase"
									value={midname} 
									onChange={(e) => setMidname(e.target.value)}
									 />
								</label>
							</div>
							<div>
								<label>Name / Given Name / First Name
									<input type="text" 
									placeholder="Name / Given Name / First Name" 
									className="uppercase" 
									value={firstname}
									onChange={(e) => setFirstname(e.target.value)}
									/>
								</label>
							</div>
							<div>
								<label>คำนำหน้าชื่อ
									<select id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)}>
										<option value="">กรุณาเลือก</option>
										<option value="Mr.">Mr.</option>
										<option value="Mrs.">Mrs.</option>
										<option value="Miss">Miss</option>
										<option value="Ms.">Ms.</option>
										<option value="Dr.">Dr.</option>
										<option value="Prof.">Prof.</option>
										<option value="Rev.">Rev.</option>
									</select>
								</label>
							</div>
						</div>
					</div>
				)}
				{title && (
					<div className="ml-2">
						<AirlineSelect onAirlineSelect={handleAirlineSelect} />
						{selectedAirline && <FlightSelect selectedAirline={selectedAirline} onChange={handleFlightSelect} />}
					</div>
				)}

				{selectedFlight && (
					<>
						<div className="flex flex-wrap ml-2">
							<div className="flex items-center">
								<input
									onChange={handleCheckbox}
									className="w-7 h-7 rounded focus:ring-2 focus:ring-blue-600"
									type="checkbox"
								/>
								<label className="ml-2" >ผู้โดยสารได้รับอนุญาตเข้าประเทศ</label>
							</div>
							<div className="flex flex-wrap items-center justify-center text-center md:text-left" hidden={checkboxdisable}>
								<div className="flex flex-col w-full sm:w-auto sm:flex-row items-center sm:ml-2 mt-2">
									<div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
										<div className="mr-2" 	hidden={disableRemark}>เทียวบินออก</div>
										<input
											type="text"
											placeholder="ตัวอย่าง ID1234"
											className="uppercase sm:w-32"
											hidden={disableRemark}
											value={outbound}
											onChange={(e) => setOutbound(e.target.value)}
										/>
									</div>
									<div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
										<div className="mr-2" 	hidden={disableRemark}>เส้นทางบิน</div>
										<input
											type="text"
											placeholder="ตัวอย่าง BKK/HKT"
											className="uppercase sm:w-32"
											hidden={disableRemark}
											value={outboundflight}
											onChange={(e) => setOutboundflight(e.target.value)}
										/>
									</div>
									<div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
										<div className="mr-2" 	hidden={disableRemark}>วันที่</div>
										<input
											type="date"
											className="uppercase sm:w-32"
											hidden={disableRemark}
											value={outbounddate}
											onChange={(e) => setOutbounddate(e.target.value)}
										/>
									</div>
									{/* <div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
										<textarea
											className="w-full sm:w-11/12 uppercase"
											placeholder="หมายเหตุอื่นๆ"
										/>
									</div> */}
								</div>
							</div>
						</div>

						<div className="mt-4">
							<button className="bg-green-600 w-full sm:w-60 h-16 flex items-center justify-center">
								<FaSave size={30} className="mr-2" />
								บันทึก
							</button>
						</div>
					</>
				)}

			</form>
		</div>
	);
}

export default InsertInad;
