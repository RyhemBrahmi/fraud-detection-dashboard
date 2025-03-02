import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BarChartComponent from "../../charts/BarChartComponent"; 

const mockData = [
    { date: "2024-01", value: 100 },
    { date: "2024-02", value: 200 },
  ];
  
  test("affiche un graphique avec des données", async () => {
    render(<BarChartComponent data={mockData} />);
    console.log(screen.debug()); // Affiche le DOM pour voir où sont les données
  
    await waitFor(() => {
      expect(screen.getByText(/2024-01/i)).toBeInTheDocument();
    });
  });
  

jest.mock("recharts", () => {
  const OriginalRecharts = jest.requireActual("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

describe("BarChartComponent", () => {
  test("affiche le titre et les boutons", () => {
    render(<BarChartComponent transactions={mockTransactions} />);

    // Check for the presence of the title
    expect(screen.getByText(/High-Risk Transactions/i)).toBeInTheDocument();

    // Check the filter buttons
    expect(screen.getByText(/By Month/i)).toBeInTheDocument();
    expect(screen.getByText(/By Year/i)).toBeInTheDocument();
  });

  test("affiche un graphique avec des données", async () => {
    render(<BarChartComponent transactions={mockTransactions} />);

    await waitFor(() => {
      expect(screen.getByText(/2024-01/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-02/i)).toBeInTheDocument();
    });
  });
});
