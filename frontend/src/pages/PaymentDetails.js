// PaymentDetails
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import services from "../services/services";
import schema from "../utils/validation";

import InputField from '../Components/InputField';
import DropDown from '../Components/DropDown';
import RadioButton from '../Components/RadioButton';
import Form from '../Components/Form';
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import ProtectedComponent from "../Components/ProtectedComponent";
import '../css/PaymentDetails.css';

// TODO First graduate

function Detail({ label, value, marks }) {
    return (
        <div className='detail'>
            <span className='detail-label'>
                <div>{label}</div><div>:</div>
            </span>
            {value}
            {marks && marks.sec && marks.max && `${parseFloat(marks.sec)} / ${parseFloat(marks.max)}`}
        </div>
    )

}

function PaymentDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const applicationNo = useSelector((state) => state.applicationNo.value)
    const userName = useSelector((state) => state.auth?.name)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const applicationData = location.state.applicationData

    const [feesToPay, setFeesToPay] = useState(0);

    const formData = {
        token_number: null,
        first_graduate: null,
        tfc_initial_payment: null,
        // Payment method arrays to support multiple payments
        fee_payment_option: [],
        // Individual payment details
        dd_amount: null,
        dd_bank_name: null,
        dd_date: null,
        dd_number: null,
        card_swipe_amount: null,
        card_swipe_reference_no: null,
        online_pay_amount: null,
        online_pay_reference_no: null,
        partial_payment: null,
        partial_payment_date: null,
    }

    const [options, setOptions] = useState({
        bank_name: {}
    });

    const { register, control, getValues, setValue, watch, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: formData,
        resolver: yupResolver(schema.PaymentDetails)
    });

    // Watch payment methods and amounts to conditionally show fields
    const paymentMethods = watch('fee_payment_option') || [];
    const ddAmount = watch('dd_amount');
    const cardAmount = watch('card_swipe_amount');
    const onlineAmount = watch('online_pay_amount');
    const partialPayment = watch('partial_payment');
    const tfcInitialPayment = watch('tfc_initial_payment');

    const first_graduate = watch('first_graduate');
    applicationData.first_graduate = first_graduate;

    useEffect(() => {
        const getDefaultValues = async () => {
            try {
                const queryParams = Object.keys(formData).join(',')
                const fetchedData = await services.getPaymentDetails(applicationNo, queryParams)

                // Add null check for fetchedData
                if (!fetchedData) {
                    console.warn('No payment details found for application:', applicationNo);
                    return;
                }

                // Convert SET field from database to array for multi-select
                if (fetchedData.fee_payment_option) {
                    const paymentMethodsArray = fetchedData.fee_payment_option.split(',').map(method => method.trim());
                    fetchedData.fee_payment_option = paymentMethodsArray;
                }

                reset(fetchedData)

                if (getValues('dd_date')) {
                    let ddDate = new Date(getValues('dd_date')).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-')
                    setValue('dd_date', ddDate)
                }

                if (getValues('partial_payment_date')) {
                    let partialDate = new Date(getValues('partial_payment_date')).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-')
                    setValue('partial_payment_date', partialDate)
                }

                if (getValues('tfc_initial_payment') === null || getValues('tfc_initial_payment') === '') {
                    setValue('tfc_initial_payment', '0')
                }
                else if (getValues('tfc_initial_payment')) {
                    setValue('tfc_initial_payment', parseInt(getValues('tfc_initial_payment'), 10))
                }
            } catch (error) {
                console.error('Error fetching payment details:', error);
                setError("Error fetching payment details!");
            }
        }

        const getOptions = async () => {
            try {
                setError(null)
                const optionsArray = Object.keys(options);
                const fetchedOptions = await Promise.all(
                    optionsArray.map((option) => services.fetchFromMaster(option))
                );
                if (!fetchedOptions[0]) {
                    setError("Error fetching options!")
                    return;
                }
                const newOptions = {};
                optionsArray.forEach((option, index) => {
                    newOptions[option] = fetchedOptions[index];
                })
                setOptions(newOptions);
            } catch (error) {
                console.error('Error fetching options:', error);
                setError("Error fetching options!");
            }
        };

        const getTotalFees = async () => {
            try {
                const response = await services.getTotalFees(applicationNo);
                if (response) {
                    setFeesToPay(response.total_fee);
                } else {
                    setError("Error fetching total fees!");
                }
            } catch (error) {
                console.error('Error fetching total fees:', error);
                setError("Error fetching total fees!");
            }
        };

        const init = async () => {
            setIsLoading(true)
            setError(null)
            try {
                await getDefaultValues();
                await getOptions();
                await getTotalFees();
            } catch (error) {
                console.error('Error during initialization:', error);
                setError("Error loading payment details!");
            } finally {
                setIsLoading(false)
            }
        };

        if (applicationNo) {
            init();
        } else {
            navigate('/login')
        }
    }, [])

    // Clear all payment method fields when "no fees" is selected
    // This useEffect was causing the issue - it was interfering with the unchecking
    useEffect(() => {
        if (paymentMethods.includes('no fees') && paymentMethods.length > 1) {
            // Clear all payment amounts and details only if other methods are also selected
            setValue('dd_amount', null);
            setValue('dd_bank_name', null);
            setValue('dd_date', null);
            setValue('dd_number', null);
            setValue('card_swipe_amount', null);
            setValue('card_swipe_reference_no', null);
            setValue('online_pay_amount', null);
            setValue('online_pay_reference_no', null);

            // Keep only "no fees" in payment methods
            setValue('fee_payment_option', ['no fees']);
        }
    }, [paymentMethods, setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError(null)

        try {
            // Calculate total amount from all payment methods (excluding no_fees)
            const totalAmount = paymentMethods.includes('no fees') ? 0 :
                (parseFloat(data.dd_amount) || 0) +
                (parseFloat(data.card_swipe_amount) || 0) +
                (parseFloat(data.online_pay_amount) || 0) +
                (parseFloat(data.tfc_initial_payment) || 0)

            console.log(totalAmount);


            const submissionData = {
                ...data,
                total_amount: totalAmount,
                // Convert array back to SET format for database
                fee_payment_option: data.fee_payment_option ? data.fee_payment_option.join(',') : ''
            };

            const response = await services.updatePaymentDetails(applicationNo, submissionData)

            if (response) {
                if (location.state && location.state.fromFinal) {
                    navigate('/final_review')
                } else {
                    navigate('/final_review')
                }
            } else {
                setError("Error submitting form!")
            }
        } catch (error) {
            console.error('Error submitting payment details:', error);
            setError("Error submitting form!");
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = getValues();
            const token_number = data.token_number ? parseInt(data.token_number, 10) : null;
            if (!token_number) {
                setError("Token number is required!");
                return;
            }
            const totalAmount = paymentMethods.includes('no fees') ? 0 :
                (parseFloat(data.dd_amount) || 0) +
                (parseFloat(data.card_swipe_amount) || 0) +
                (parseFloat(data.online_pay_amount) || 0) +
                (parseFloat(data.tfc_initial_payment) || 0)

            // Check if total amount is sufficient or if partial payment is allowed
            const canApprove = totalAmount >= feesToPay || data.partial_payment === 'yes';

            if (!canApprove) {
                setError("Total amount is less than required fees!");
                return;
            }

            const submissionData = {
                ...data,
                total_amount: totalAmount,
                approved_by: userName,
                // Convert array back to SET format for database
                fee_payment_option: data.fee_payment_option ? data.fee_payment_option.join(',') : ''
            };

            const response = await services.updatePaymentDetails(applicationNo, submissionData)

            if (response) {
                alert('Payment approved successfully!');
                if (location.state && location.state.fromFinal) {
                    navigate('/final_review')
                }
                else if (location.state && location.state.fromPaymentNotVerifiedApplication) {
                    navigate('/incomplete_application')
                } else {
                    navigate('/final_review')
                }
            } else {
                setError("Error approving payment!")
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            setError("Error approving payment!");
        } finally {
            setIsLoading(false)
        }
    }

    const paymentMethodOptions = [
        { value: 'demand draft', label: 'Demand Draft' },
        { value: 'card swiping', label: 'Card Swiping' },
        { value: 'online payment', label: 'Online Payment' },
        { value: 'no fees', label: 'No Fees (Fee exemption)' }
    ];

    const handlePaymentMethodChange = (method) => {
        const currentMethods = getValues('fee_payment_option') || [];

        if (method === 'no fees') {
            if (currentMethods.includes('no fees')) {
                // If "no fees" is already selected, unselect it
                setValue('fee_payment_option', []);
            } else {
                // If "no fees" is selected, clear everything else and select only "no fees"
                // Clear payment fields immediately when selecting "no fees"
                setValue('dd_amount', null);
                setValue('dd_bank_name', null);
                setValue('dd_date', null);
                setValue('dd_number', null);
                setValue('card_swipe_amount', null);
                setValue('card_swipe_reference_no', null);
                setValue('online_pay_amount', null);
                setValue('online_pay_reference_no', null);

                setValue('fee_payment_option', ['no fees']);
            }
        } else {
            // If any other method is selected, remove "no fees"
            let updatedMethods = currentMethods.filter(m => m !== 'no fees');

            if (updatedMethods.includes(method)) {
                // Remove the method if it's already selected
                updatedMethods = updatedMethods.filter(m => m !== method);
            } else {
                // Add the method if it's not selected
                updatedMethods.push(method);
            }

            setValue('fee_payment_option', updatedMethods);
        }
    };

    const calculateTotalAmount = () => {
        return paymentMethods.includes('no fees') ? 0 :
            (parseFloat(ddAmount) || 0) +
            (parseFloat(cardAmount) || 0) +
            (parseFloat(onlineAmount) || 0) +
            (parseFloat(tfcInitialPayment) || 0)

    };

    const renderPaymentMethodFields = () => {
        const totalAmount = calculateTotalAmount();
        const isAmountSufficient = totalAmount >= feesToPay;

        return (
            <div>
                {/* Payment Method Selection */}
                <Row>
                    <div className="payment-method-selection">
                        <div className="payment-method-options">
                            {paymentMethodOptions.map((option) => (
                                <div key={option.value} className="payment-method-option">
                                    <input
                                        type="checkbox"
                                        id={option.value}
                                        checked={paymentMethods.includes(option.value)}
                                        onChange={() => handlePaymentMethodChange(option.value)}
                                        className="payment-method-checkbox"
                                    />
                                    <label htmlFor={option.value} className="payment-method-label">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Row>

                {/* Demand Draft Section */}
                {paymentMethods.includes('demand draft') && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">Demand Draft Payment Details</div>
                        <Row>
                            <InputField
                                label="Demand Draft Amount"
                                registerProps={register("dd_amount")}
                                type="number"
                                step="0.01"
                                error={errors.dd_amount && errors.dd_amount.message}
                                required
                            />
                            <DropDown
                                label="Bank Name"
                                options={options['bank_name']}
                                fieldname={"dd_bank_name"}
                                formcontrol={control}
                                error={errors.dd_bank_name && errors.dd_bank_name.message}
                                required
                            />
                        </Row>
                        <Row>
                            <InputField
                                label="DD Date"
                                registerProps={register("dd_date")}
                                type="date"
                                error={errors.dd_date && errors.dd_date.message}
                                required
                            />
                            <InputField
                                label="DD Number"
                                registerProps={register("dd_number")}
                                type="text"
                                error={errors.dd_number && errors.dd_number.message}
                                required
                            />
                        </Row>
                    </div>
                )}

                {/* Card Swiping Section */}
                {paymentMethods.includes('card swiping') && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">Card Swiping Payment Details</div>
                        <Row>
                            <InputField
                                label="Card Swipe Amount"
                                registerProps={register("card_swipe_amount")}
                                type="number"
                                step="0.01"
                                error={errors.card_swipe_amount && errors.card_swipe_amount.message}
                                required
                            />
                            <InputField
                                label="Card Reference Number"
                                registerProps={register("card_swipe_reference_no")}
                                type="text"
                                error={errors.card_swipe_reference_no && errors.card_swipe_reference_no.message}
                                required
                            />
                        </Row>
                    </div>
                )}

                {/* Online Payment Section */}
                {paymentMethods.includes('online payment') && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">Online Payment Details</div>
                        <Row>
                            <InputField
                                label="Online Payment Amount"
                                registerProps={register("online_pay_amount")}
                                type="number"
                                step="0.01"
                                error={errors.online_pay_amount && errors.online_pay_amount.message}
                                required
                            />
                            <InputField
                                label="Online Reference Number"
                                registerProps={register("online_pay_reference_no")}
                                type="text"
                                error={errors.online_pay_reference_no && errors.online_pay_reference_no.message}
                                required
                            />
                        </Row>
                    </div>
                )}

                {/* Partial Payment Section - Only visible to accounts_manager */}
                <ProtectedComponent users={['accounts_manager']}>
                    <Row>
                        <DropDown
                            label="Allow Partial Payment"
                            options={{
                                'no': 'No',
                                'yes': 'Yes'
                            }}
                            fieldname={"partial_payment"}
                            formcontrol={control}
                            error={errors.partial_payment && errors.partial_payment.message}
                        />

                        {/* Partial Payment Date - Only show if partial payment is "yes" */}
                        {partialPayment === 'yes' && (
                            <InputField
                                label="Partial Payment Date"
                                registerProps={register("partial_payment_date")}
                                type="date"
                                required
                            />
                        )}
                    </Row>
                </ProtectedComponent>

                {/* No Fees Message */}
                {paymentMethods.includes('no fees') && (
                    <Row>
                        <div className="no-fees-message">
                            <div className="no-fees-text">
                                Fee exemption selected - No payment required
                            </div>
                        </div>
                    </Row>
                )}

                {/* Fees To Pay and Total Amount Display */}
                {paymentMethods.length > 0 && !paymentMethods.includes('no fees') && (
                    <div className="payment-summary-section">
                        <Row>
                            <div className="fees-to-pay-display">
                                <div className="fees-to-pay-text">
                                    Fees to be Paid: ₹{feesToPay.toFixed(2)}
                                </div>
                            </div>
                            <div className={`total-amount-display ${isAmountSufficient ? 'sufficient' : 'insufficient'}`}>
                                <div className="total-amount-text">
                                    Total Amount: ₹{totalAmount.toFixed(2)}
                                </div>
                            </div>
                        </Row>
                    </div>
                )}

                {/* Approve Button - Only visible to admin, manager, accounts_manager */}
                <ProtectedComponent users={['admin', 'manager', 'accounts_manager']}>
                    <Row>
                        <div className="approve-button-container">
                            <button
                                type="button"
                                onClick={handleApprove}
                                className="approve-button"
                                disabled={isLoading}
                            >
                                Approve Payment
                            </button>
                        </div>
                    </Row>
                </ProtectedComponent>
            </div>
        );
    };

    return (
        <div className="payment-details-container">
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <Form handleNext={handleSubmit(onSubmit)} heading="Payment Details" handleBack={() => { navigate('/additional_details') }}>
                <div className='details-container'>
                    <div className='detail-row'>
                        {applicationData &&
                            Object.entries(applicationData)
                                .filter(([key]) => key !== 'student_name' && key !== 'initial')
                                .map((item, index) => (
                                    // <div key={index} className='modal-data-row'>
                                    //     <span className='modal-data-label'>{item[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}:</span> {/* Convert snake_case to a displayable format */}
                                    //     <span className='modal-data-value'>{item[1]}</span>
                                    // </div>
                                    <Detail label={item[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')} value={item[1]} />
                                ))
                        }
                    </div>
                </div>
                <hr></hr>
                <Row>
                    <ProtectedComponent users={['admin', 'manager', 'accounts_manager']}>
                        <InputField
                            label="Token Number"
                            registerProps={register("token_number")}
                            type="number"
                            error={errors.token_number && errors.token_number.message}
                            required
                        />
                    </ProtectedComponent>
                    <DropDown
                        label="TFC Initial Payment"
                        options={{ '0': '0', '5000': '5000', '25000': '25000', '300000': '300000' }}
                        fieldname={"tfc_initial_payment"}
                        formcontrol={control}
                        error={errors.tfc_initial_payment && errors.tfc_initial_payment.message}
                        required
                    />
                </Row>

                <div className="payment-methods-section">
                    <div className="payment-methods-title">Payment Method Selection</div>
                    {renderPaymentMethodFields()}
                </div>
            </Form>
        </div>
    )
}

export default PaymentDetails