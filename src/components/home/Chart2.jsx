import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Example extends PureComponent {
    render() {
        const { reportesEBR, reportesCEBA, reportesRESIDENCIA } = this.props;

        console.log('reportesEBR:', reportesEBR);
        console.log('reportesCEBA:', reportesCEBA);
        console.log('reportesRESIDENCIA:', reportesRESIDENCIA);

        let data = [];

        if (
            reportesEBR && reportesEBR.pagos && reportesEBR.pagos.length > 0 &&
            reportesCEBA && reportesCEBA.pagos && reportesCEBA.pagos.length > 0 &&
            reportesRESIDENCIA && reportesRESIDENCIA.pagos && reportesRESIDENCIA.pagos.length > 0
        ) {
            data = [
                {
                    name: 'MODALIDAD EBR',
                    total_pagos_año_actual: reportesEBR.pagos[0].monto_total_pagos_por_anio || 0,
                    total_pagos: reportesEBR.pagos[0].monto_total_pagos || 0,
                },
                {
                    name: 'MODALIDAD CEBA',
                    total_pagos_año_actual: reportesCEBA.pagos[0].monto_total_pagos_por_anio || 0,
                    total_pagos: reportesCEBA.pagos[0].monto_total_pagos || 0,
                },
                {
                    name: 'MODALIDAD RESIDENCIA',
                    total_pagos_año_actual: reportesRESIDENCIA.pagos[0].monto_total_pagos_por_anio || 0,
                    total_pagos: reportesRESIDENCIA.pagos[0].monto_total_pagos || 0,
                },
            ];
        } else {
            console.warn('Los datos de pagos no están disponibles para una o más modalidades.');
        }

        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="10 10" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                        contentStyle={{ color: 'black' }}
                        formatter={(value, name, props) => {
                            return [value, name];
                        }}
                        shared
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total_pagos_año_actual" stroke="#8884d8" />
                    <Line type="monotone" dataKey="total_pagos" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
