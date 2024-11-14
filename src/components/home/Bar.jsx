import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class GraficoBar extends PureComponent {

    render() {
        const { reportesEBR, reportesCEBA, reportesRESIDENCIA } = this.props;

        console.log('reportesEBR:', reportesEBR);
        console.log('reportesCEBA:', reportesCEBA);
        console.log('reportesRESIDENCIA:', reportesRESIDENCIA);

        let data = [];

        if (
            reportesEBR && reportesEBR.estudiantes && reportesEBR.estudiantes.length > 0 &&
            reportesCEBA && reportesCEBA.estudiantes && reportesCEBA.estudiantes.length > 0 &&
            reportesRESIDENCIA && reportesRESIDENCIA.estudiantes && reportesRESIDENCIA.estudiantes.length > 0
        ) {
            data = [
                {
                    name: 'ESTUDIANTES EBR',
                    femeninos: reportesEBR.estudiantes[0].estudiantes_femeninos || 0,
                    masculinos: reportesEBR.estudiantes[0].estudiantes_masculinos || 0,
                    total: reportesEBR.estudiantes[0].total_estudiantes || 0,
                },
                {
                    name: 'ESTUDIANTES CEBA',
                    femeninos: reportesCEBA.estudiantes[0].estudiantes_femeninos || 0,
                    masculinos: reportesCEBA.estudiantes[0].estudiantes_masculinos || 0,
                    total: reportesCEBA.estudiantes[0].total_estudiantes || 0,
                },
                {
                    name: 'ESTUDIANTES RESIDENCIA',
                    femeninos: reportesRESIDENCIA.estudiantes[0].estudiantes_femeninos || 0,
                    masculinos: reportesRESIDENCIA.estudiantes[0].estudiantes_masculinos || 0,
                    total: reportesRESIDENCIA.estudiantes[0].total_estudiantes || 0,
                },
            ];
        }

        return (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="10 10" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ color: 'black' }} />
                    <Legend />
                    <Bar dataKey="masculinos" fill="#8884d8" />
                    <Bar dataKey="femeninos" fill="#82ca9d" />
                    <Bar dataKey="total" fill="gray" />
                    <Cell fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
