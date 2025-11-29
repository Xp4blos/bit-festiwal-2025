// import React from "react";
// // Upewnij się, że ścieżka do Twojego hooka jest poprawna
// import useGeoLocation from "../hooks/useGeoLocation";

// function GeolocationTester() {
//   const { loaded, coordinates, error } = useGeoLocation();

//   // Proste style inline dla czytelności (możesz zastąpić klasami CSS/Tailwind)
//   const styles = {
//     container: {
//       maxWidth: "500px",
//       margin: "2rem auto",
//       padding: "2rem",
//       borderRadius: "12px",
//       boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//       fontFamily: "system-ui, sans-serif",
//       backgroundColor: "#ffffff",
//       border: "1px solid #e0e0e0",
//     },
//     header: {
//       borderBottom: "2px solid #f0f0f0",
//       paddingBottom: "1rem",
//       marginBottom: "1rem",
//     },
//     statusBadge: (isError: boolean, isLoaded: boolean) => ({
//       display: "inline-block",
//       padding: "4px 12px",
//       borderRadius: "20px",
//       fontSize: "0.85rem",
//       fontWeight: "bold",
//       backgroundColor: isError ? "#ffebee" : isLoaded ? "#e8f5e9" : "#e3f2fd",
//       color: isError ? "#c62828" : isLoaded ? "#2e7d32" : "#1565c0",
//     }),
//     dataRow: {
//       display: "flex",
//       justifyContent: "space-between",
//       padding: "0.5rem 0",
//       borderBottom: "1px solid #f5f5f5",
//     },
//     label: {
//       fontWeight: 600,
//       color: "#555",
//     },
//     value: {
//       fontFamily: "monospace",
//       color: "#333",
//     },
//     mapLink: {
//       display: "block",
//       textAlign: "center" as const,
//       marginTop: "1.5rem",
//       padding: "0.75rem",
//       backgroundColor: "#4285F4",
//       color: "white",
//       textDecoration: "none",
//       borderRadius: "6px",
//       fontWeight: "bold",
//     },
//     errorBox: {
//       backgroundColor: "#ffebee",
//       color: "#c62828",
//       padding: "1rem",
//       borderRadius: "6px",
//       marginTop: "1rem",
//     },
//   };

//   // Określenie statusu tekstowego
//   let statusText = "Pobieranie...";
//   if (loaded && error) statusText = "Błąd";
//   if (loaded && !error) statusText = "Sukces";

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2 style={{ margin: 0, marginBottom: "10px" }}>Geolokalizacja Test</h2>
//         <span style={styles.statusBadge(!!error, loaded)}>
//           Status: {statusText}
//         </span>
//       </div>

//       {/* Sekcja ładowania */}
//       {!loaded && (
//         <div style={{ textAlign: "center", padding: "2rem" }}>
//           <p>Czekam na zgodę przeglądarki...</p>
//         </div>
//       )}

//       {/* Sekcja błędu */}
//       {error && (
//         <div style={styles.errorBox}>
//           <strong>Wystąpił problem:</strong>
//           <p style={{ margin: "0.5rem 0 0 0" }}>
//             {error.message} (Kod: {error.code})
//           </p>
//         </div>
//       )}

//       {/* Sekcja danych */}
//       {coordinates && (
//         <div>
//           <div style={styles.dataRow}>
//             <span style={styles.label}>Szerokość (Lat):</span>
//             <span style={styles.value}>{coordinates.latitude}</span>
//           </div>
//           <div style={styles.dataRow}>
//             <span style={styles.label}>Długość (Lng):</span>
//             <span style={styles.value}>{coordinates.longitude}</span>
//           </div>

//           {/* Debug info - surowy obiekt */}
//           <details
//             style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}
//           >
//             <summary style={{ cursor: "pointer" }}>
//               Pokaż surowe dane JSON
//             </summary>
//             <pre
//               style={{
//                 background: "#f5f5f5",
//                 padding: "10px",
//                 borderRadius: "4px",
//               }}
//             >
//               {JSON.stringify(coordinates, null, 2)}
//             </pre>
//           </details>

//           <a
//             href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={styles.mapLink}
//           >
//             📍 Otwórz w Google Maps
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GeolocationTester;
