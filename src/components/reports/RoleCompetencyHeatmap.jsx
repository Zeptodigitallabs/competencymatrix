import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardService from '../../services/DashboardService';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoleCompetencyHeatmap = () => {
    const [heatmapData, setHeatmapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const response = await DashboardService.getCompetencyRoleHeatmap();

                const apiData = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.data)
                            ? response.data.data
                            : [];

                const formattedData = convertToHeatmapData(apiData);
                setHeatmapData(formattedData);
            } catch (error) {
                console.error('Error fetching heatmap data:', error);
                toast.error('Failed to load competency role heatmap data');
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmapData();

        return () => {
            try {
                if (chartRef.current && chartRef.current.canvas) {
                    chartRef.current.destroy();
                }
            } catch (e) {
                // ignore cleanup errors
            }
        };
    }, []);

    const convertToHeatmapData = (apiData) => {
        if (!Array.isArray(apiData) || apiData.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Unique competencies (X-axis)
        const labels = [
            ...new Set(apiData.map(item => item.competencyName))
        ];

        // Unique roles (datasets)
        const roles = [
            ...new Set(apiData.map(item => item.roleName))
        ];

        const datasets = roles.map(role => ({
            label: role,
            data: labels.map(label => {
                const record = apiData.find(
                    r => r.roleName === role && r.competencyName === label
                );

                if (!record) return 0;

                const { totalAchieved, totalEmpCount } = record;

                // Scale to 0–5 (or return totalAchieved if you prefer)
                return totalEmpCount > 0
                    ? Math.round((totalAchieved / totalEmpCount) * 5)
                    : 0;
            }),
            borderColor: 'rgba(79, 70, 229, 0.8)',
            borderWidth: 1
        }));

        return { labels, datasets };
    };

    if (loading) {
        return <div>Loading heatmap data...</div>;
    }

    if (!heatmapData) {
        return <div>No data available for the heatmap</div>;
    }

    // Add your heatmap rendering logic here
    return (
        <div className="mt-8">
            <h4 className="text-md font-medium mb-4">Competency vs Role Heatmap</h4>
            <div className="h-96">
                <Bar
                    ref={chartRef}
                    data={heatmapData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Competencies',
                                },
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => `Level: ${context.raw}`,
                                },
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default RoleCompetencyHeatmap;