import axios from "axios";

export const api = axios.create({
    baseURL : "http://localhost:8080",
    withCredentials: true 
})

// to add a new room to the db
export async function addRoom(photo,roomType,roomPrice) {
    const formData = new FormData();
    formData.append("photo",photo);
    formData.append("roomType",roomType);
    formData.append("roomPrice",roomPrice);
    
    const response = await api.post("/rooms/add/new-room",formData)
    if(response.status === 201){
        return true
    }
    else{
        return false
    }
}

//To get all room types from the db
export async function getRoomTypes() {
    try{
        const response = await api.get("/rooms/room-types")
        return response.data
    }catch(error){
        throw new Error("Error fetching room types")
    }
}

//To get all rooms
export async function getAllRooms(){
    try{
        const result = await api.get("/rooms/all")
        return result.data
    }catch(error){
        throw new Error("Error fetching rooms")
    }
}

//to delete a room by id
export async function deleteRoom(roomId){
    try{
        const result = await api.delete(`/rooms/delete/room/${roomId}`)
        return result.data
    }catch(error){
        throw new Error(`Error deleting room ${error.message}`)
    }
}

//to update a room
export async function updateRoom(roomId, roomData){
    try{
        const formData = new FormData();
        formData.append("roomType", roomData.roomType);
        formData.append("roomPrice", roomData.roomPrice);
        formData.append("photo", roomData.photo);

        // Remarque : la requête PUT doit inclure formData dans le body
        const response = await api.put(`/rooms/update/${roomId}`, formData);
        return response;
    }catch(error){
        throw new Error(`Error updating room: ${error.message}`);
    }
}

//to get a room by id
export async function getRoomById(roomId) {
    try{
        const result = await api.get(`rooms/room/${roomId}`)
        return result.data
    }catch(error){
        throw new Error(`Error fetching room ${error.message}`)
    }
}

//to save a new booking to the db
export async function bookRoom(roomId, booking) {
    if (!roomId) {
        throw new Error("Room ID is required");
    }
    
    try {
        const response = await api.post(`/bookings/room/${roomId}/booking`, booking);
        return response.data;
    } catch(error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Error booking room: ${error.message}`);
        }
    }
}

//to get all bookings from the db
export async function getAllBookings() {
    try{
        const result = await api.get("/bookings/all-bookings")
        return result.data
    }catch(error){
        throw new Error(`Error fetching bookings : ${error.message}`)
    }
}

//to get booking by the confirmation code
export async function getBookingByConfirmationCode(confirmationCode) {
    try{
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
        return result.data
    }catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }else{
            throw new Error(`Error finding booking : ${error.message}`)
        }
    }
}

//to cancel booking
export async function cancelBooking(bookingId) {
    try{
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
        return result.data
    }catch(error){
        throw new Error(`Error cancelling booking : ${error.message}`)
    }
}