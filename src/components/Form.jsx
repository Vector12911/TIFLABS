import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import moment from 'moment';
import './Form.css';

export const Form = () => {

    const [data, setData] = useState(null);
    const [loading, setloading] = useState(false);
    const [isRed, setisRed] = useState(false);

    useEffect(() => {
        let data = localStorage.getItem('data');
        if (data) {
            data = JSON.parse(data);
            setData(data);
        }
    }, [])

    const dateVlidater = (date_range, day, sign) => {
        const [start_date, end_date] = date_range.split(' ');
        const [start_month, start_day] = start_date.split('_');
        console.log(start_month, start_day);
        const [end_month, end_day] = end_date.split('_');
        console.log(end_month, end_day);
        let date = null;
        if (day === 'today') {
            date = moment();
        } else if (day === 'tomorrow') {
            date = moment().add(1, 'day');
        } else {
            date = moment().subtract(1, 'day');
        }
        date = date.toDate();
        // console.log(date);
        const input_day = date.getDay();
        const input_month = date.getMonth();
        // const input_day = 17;
        // const input_month = 0;
        console.log(input_month, input_day);
        if (sign === 'capricorn') {
            if ((input_month === parseInt(start_month) && input_day > parseInt(start_day))
                || (input_month === parseInt(end_month) && input_day < parseInt(end_day))
            ) {
                console.log('success');
                setisRed(true)
            } else {
                return;
            }
        }
        else if (
            input_month < parseInt(start_month)
            || (input_month === parseInt(start_month) && input_day < parseInt(start_day))
            || input_month > parseInt(end_month)
            || (input_month === parseInt(end_month) && input_day > parseInt(end_day))
        ) {
            console.log('return');
            return;
        } else {
            console.log('success');
            setisRed(true)
        }
    }
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            signs: null,
            day: null,
        },
        validate: (data) => {
            let errors = {};

            if (!data.name) {
                errors.name = 'Name is required.';
            }

            if (!data.email) {
                errors.email = 'Email is required.';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Invalid email address. E.g. example@email.com';
            }

            return errors;
        },
        onSubmit: async (values) => {
            console.log(values);
            try {
                setloading(true);
                dateVlidater(values.signs.date_range, values.day.name, values.signs.name);
                const res = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${values.signs.name}/${values.day.name}`)
                const data = await res.json();
                let dataObj = { name: values.name, email: values.email, sunsign: data.sunsign, horoscope: data.horoscope };
                localStorage.setItem('data', JSON.stringify(dataObj));
                setData(dataObj);
                // formik.resetForm();
            } catch (error) {
                console.log(error);
            }
            setloading(false)
        }
    });

    // console.log(data);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const horoscope_sign = [
        { name: 'aries', date_range: '2_21 3_19' },
        { name: 'taurus', date_range: '3_20 4_20' },
        { name: 'gemini', date_range: '4_21 5_20' },
        { name: 'cancer', date_range: '5_21 6_22' },
        { name: 'leo', date_range: '6_23 7_22' },
        { name: 'virgo', date_range: '7_23 8_22' },
        { name: 'libra', date_range: '8_23 9_22' },
        { name: 'scorpio', date_range: '9_23 10_21' },
        { name: 'sagittarius', date_range: '10_22 11_21' },
        { name: 'capricorn', date_range: '11_22 0_19' },
        { name: 'aquarius', date_range: '0_20 1_18' },
        { name: 'pisces', date_range: '1_19 3_20' },
    ];
    const day = [
        { name: 'today' },
        { name: 'tomorrow' },
        { name: 'yesterday' },
    ];

    return (
        <>
            <div className="layout">
                <div className="form-demo">
                    <div className="flex justify-content-center">
                        <div className="card">
                            <form onSubmit={formik.handleSubmit} className="p-fluid">
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                        <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
                                    </span>
                                    {getFormErrorMessage('name')}
                                </div>
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right">
                                        <i className="pi pi-envelope" />
                                        <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                        <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
                                    </span>
                                    {getFormErrorMessage('email')}
                                </div>

                                <div className="field">
                                    <span className="p-float-label">
                                        <Dropdown id="signs" name="signs" value={formik.values.signs} onChange={formik.handleChange} options={horoscope_sign} optionLabel="name" />
                                        <label htmlFor="signs">Horoscope Signs</label>
                                    </span>
                                </div>
                                <div className="field">
                                    <span className="p-float-label">
                                        <Dropdown id="day" name="day" value={formik.values.day} onChange={formik.handleChange} options={day} optionLabel="name" />
                                        <label htmlFor="day">Choose Day</label>
                                    </span>
                                </div>
                                {loading && <Button label="Submit" loading className="mt-2" />}
                                {!loading && <Button type="submit" label="Submit" className="mt-2" />}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {
                data && (<div className={`container ${isRed ? 'green' : ''}`}>
                    <div className="horoscope-data">
                        <div className="horoscope-item">
                            <div style={{ marginRight: '10px' }}>Name:</div>
                            <div>{data.name}</div>
                        </div>
                        <div className="horoscope-item">
                            <div style={{ marginRight: '10px' }}>Email:</div>
                            <div>{data.email}</div>
                        </div>
                        <div className="horoscope-item">
                            <div style={{ marginRight: '10px' }}>Sunsign:</div> <div>{data.sunsign}</div>
                        </div>
                        <div className="horoscope-item">
                            <div style={{ marginRight: '10px' }}>Horoscope:</div> <div>{data.horoscope}</div>
                        </div>
                    </div>
                </div>)
            }

        </>

    );
}
