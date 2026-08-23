const calculateFine = (dueDate, returnDate) => {

const due = new Date(dueDate);

const returned = new Date(returnDate);

const diff = returned - due;

const days = Math.ceil(
diff / (1000 * 60 * 60 * 24)
);


if(days <= 0){

return {

daysLate: 0,
amount: 0

};

}


return {

daysLate: days,
amount: days * 20

};

};


module.exports = calculateFine;