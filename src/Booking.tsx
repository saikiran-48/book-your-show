import { Alert, Box, Button, Divider, Snackbar, Typography } from '@mui/material'
import { useMemo } from 'react';
import { useState } from 'react';

function Booking({ data }: any) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const ROWDATA = Array.from({ length: data?.rows });
    const SEATDATA = Array.from({ length: data?.seatsPerRow });

    const toggleSeat = (id: string) => {
        setSelectedSeats((prev) => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            } else {
                return [...prev, id];
            }
        })
    };

    const resetSelection = () => {
        setSelectedSeats([]);
    }


    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((acc, seatId) => {
            const rowIndex = seatId.charCodeAt(0) - 65;
            console.log('rowIndex', rowIndex);
            const seatType = (data?.seatTypes ?? []).find((type: any) =>
                type.rows?.includes(rowIndex)
            );
            return acc + seatType?.price ;
        }, 0);
    }, [selectedSeats]);

    function bookTickets() {
        const updated = [...new Set([...data.bookedSeats, ...selectedSeats])];
        data.bookedSeats = updated;
        data.onBookingComplete(updated);
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
            setSelectedSeats([]);
        }, 3000);
    }


    return (
        <Box sx={styles.container}>
            <Box sx={styles.wrapper}>
                <Typography sx={{ textAlign: "center", }} variant="h3">{data?.info?.title}</Typography>
                <Typography sx={{ textAlign: "center", py: 2 }} variant='h6'>{data?.info?.subtitle}</Typography>
                <Divider sx={styles.divider} />

                <Box sx={{ mb: 6, overflow: "auto" }}>

                    {ROWDATA.map((_, i) => {
                        const rowAlphabet = String.fromCharCode(65 + i);
                        const seatType = data?.seatTypes.find((data: any) => data.rows.includes(i))

                        return (
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }} key={i}>
                                <Typography>{rowAlphabet}</Typography>
                                {SEATDATA.map((_, j) => {
                                    const seatId = `${rowAlphabet}${j + 1}`;
                                    const isSelected = selectedSeats.includes(seatId);

                                    return (
                                        <>
                                            <Button
                                                key={seatId}
                                                disabled={data?.bookedSeats.includes(seatId)}
                                                onClick={() => toggleSeat(seatId)}
                                                variant={isSelected ? 'contained' : 'outlined'}
                                                sx={{
                                                    backgroundColor: !isSelected
                                                        ? seatType?.color
                                                        : "outlined",
                                                    borderColor: `2px solid ${seatType?.color}`,
                                                    margin: `0.6rem  ${data?.aislePositions.includes(j) ? "2.6rem" : "0.6rem"} 0.6rem 0.6rem`,
                                                    minWidth: "3rem",
                                                    minHeight: "3rem",
                                                }}
                                            >
                                                {j + 1}
                                            </Button>
                                        </>
                                    );
                                })}
                            </Box>
                        );
                    })}

                </Box>

                {
                    selectedSeats.length > 0 &&
                    <Box sx={styles.summary}>
                        <Box sx={styles.summaryContent}>
                            <Typography variant="h6" sx={styles.summaryTitle}>
                                Booking Summary
                            </Typography>

                            <Typography sx={styles.summaryRow}>
                                <strong>Seats:</strong> {selectedSeats.length}
                            </Typography>

                            <Typography sx={styles.summaryRow}>
                                <strong>Selected:</strong> {selectedSeats.join(", ") || "None"}
                            </Typography>

                            <Typography sx={styles.summaryRow}>
                                <strong>Total:</strong> {data.currency} {totalPrice}
                            </Typography>
                        </Box>

                        <Button variant="outlined" sx={styles.resetButton} onClick={resetSelection}>
                            Reset
                        </Button>
                    </Box>
                }
                <Button
                    disabled={selectedSeats.length === 0}
                    variant="contained"
                    fullWidth
                    sx={styles.bookButton}
                    onClick={bookTickets}
                >
                    Book Tickets
                </Button>


            </Box>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                        width: "40rem",
                        textAlign: "center",
                        "& .MuiAlert-message": {
                            width: "100%",
                            textAlign: "center",
                        }
                    }}
                >
                    Successfully booked seats: {selectedSeats.join(", ")} for a total of {data.currency} {totalPrice}
                </Alert>
            </Snackbar>


        </Box>
    )
}

const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        color: "black",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
    },
    wrapper: {
        boxShadow: 15,
        borderRadius: 2,
        padding: "2rem 4rem",
    },
    divider: {
        margin: "auto",
        marginBottom: "1rem",
        height: "4px",
        backgroundColor: "lightgray",
        width: "85%",
        borderRadius: "8px",
    },
    summary: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        backgroundColor: "#f7f7f7",
        border: "1px solid #e0e0e0",
        marginTop: "1rem",
    },

    summaryContent: {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
    },

    summaryTitle: {
        fontWeight: 700,
        marginBottom: "0.4rem",
    },

    summaryRow: {
        fontSize: "0.95rem",
        color: "#333",
    },

    resetButton: {
        height: "2rem",
        textTransform: "none",
    },

    bookButton: {
        marginTop: "1rem",
        textTransform: "none",
        height: "2.5rem",
        fontSize: "1rem",
        fontWeight: 600,
    },



}

export default Booking
