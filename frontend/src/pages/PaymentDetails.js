// PaymentDetails
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import services from "../services/services";
import schema from "../utils/validation";

import InputField from "../Components/InputField";
import DropDown from "../Components/DropDown";
import Form from "../Components/Form";
import Row from "../Components/Row";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import ProtectedComponent from "../Components/ProtectedComponent";
import "../css/PaymentDetails.css";

function PaymentDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const applicationNo = useSelector((state) => state.applicationNo.value);
    const userName = useSelector((state) => state.auth?.name);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [busRequired, setBusRequired] = useState(true);
    const [isDefaultValuesFetched, setIsDefaultValuesFetched] = useState(false);

    const [feesToPay, setFeesToPay] = useState(0);
    const [feeBreakdown, setFeeBreakdown] = useState({
        total_fee: 0,
        bus_fee: 0,
        first_graduate: 0,
    });

    // State to store display values for course and branch
    const [displayValues, setDisplayValues] = useState({
        course_name: "",
        branch_name: "",
        bus_route_name: "",
    });

    const formData = {
        token_number: null,
        pre_student_register_sno: null,
        seat_category: null,
        application_id: null,
        year: null,
        course_id: null,
        branch_id: null,
        student_name: null,
        mobile_number: null,
        scholar: null,
        bus_route: null,
        bus_boarding_point: null,
        tfc_initial_payment: null,
        first_graduate: "no", // Default to "no"
        fee_payment_option: [],
        dd_date: null,
        dd_amount: null,
        dd_number: null,
        dd_bank_name: null,
        card_swipe_reference_no: null,
        card_swipe_amount: null,
        online_pay_reference_no: null,
        online_pay_amount: null,
        total_amount: null,
        partial_payment: "no", // Default to "no"
        partial_payment_date: null,
    };

    const [options, setOptions] = useState({
        bank_name: {},
        boarding_point: {},
    });

    const {
        register,
        control,
        getValues,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: formData,
        resolver: yupResolver(schema.PaymentDetails),
    });

    // Watch payment methods and amounts to conditionally show fields
    const paymentMethods = watch("fee_payment_option") || [];
    const ddAmount = watch("dd_amount");
    const cardAmount = watch("card_swipe_amount");
    const onlineAmount = watch("online_pay_amount");
    const partialPayment = watch("partial_payment");
    const tfcInitialPayment = watch("tfc_initial_payment");

    const first_graduate = watch("first_graduate");

    const busBoardingPoint = watch("bus_boarding_point");

    // Track the previous value to avoid unnecessary updates
    const [prevBusBoardingPoint, setPrevBusBoardingPoint] = useState(null);

    useEffect(() => {
        const updateBusBoardingPoint = async () => {
            try {
                const updatePaymentDet = await services.updatePaymentDetails(
                    applicationNo,
                    {
                        bus_boarding_point: busBoardingPoint,
                    }
                );

                if (updatePaymentDet) {
                    // Update the previous value to prevent re-triggering
                    setPrevBusBoardingPoint(busBoardingPoint);

                    //   window.location.reload()
                    await getTotalFees();
                    await getDefaultValues();

                    console.log("Bus boarding point updated successfully");
                }
            } catch (error) {
                console.error("Error updating bus boarding point:", error);
                setError("Failed to update bus boarding point");
            }
        };

        // Only update if:
        // 1. busBoardingPoint has a value
        // 2. applicationNo exists
        // 3. busBoardingPoint has actually changed from the previous value
        if (
            busBoardingPoint &&
            applicationNo &&
            busBoardingPoint !== prevBusBoardingPoint &&
            busRequired === true &&
            isDefaultValuesFetched
        ) {
            updateBusBoardingPoint();
        }
    }, [busBoardingPoint, applicationNo, prevBusBoardingPoint]);

    // Clear partial payment date when partial payment is set to "no"
    useEffect(() => {
        if (partialPayment === "no") {
            setValue("partial_payment_date", null);
        }
    }, [partialPayment, setValue]);

    const getTotalFees = async () => {
        try {
            const response = await services.getTotalFees(applicationNo);
            if (response) {
                setFeesToPay(response.to_be_paid);
                setFeeBreakdown({
                    total_fee: response.total_fee || 0,
                    bus_fee: response.bus_fee || 0,
                    first_graduate: response.first_graduate || 0,
                });
            } else {
                setError("Error fetching total fees!");
            }
        } catch (error) {
            console.error("Error fetching total fees:", error);
            setError("Error fetching total fees!");
        }
    };

    const getDefaultValues = async () => {
        try {
            const queryParams = Object.keys(formData).join(",");
            const fetchedData = await services.getPaymentDetails(
                applicationNo,
                queryParams
            );

            // Add null check for fetchedData
            if (!fetchedData) {
                console.warn(
                    "No payment details found for application:",
                    applicationNo
                );
                return;
            }

            // Convert SET field from database to array for multi-select
            if (fetchedData.fee_payment_option) {
                const paymentMethodsArray = fetchedData.fee_payment_option
                    .split(",")
                    .map((method) => method.trim());
                fetchedData.fee_payment_option = paymentMethodsArray;
            }

            // Ensure partial_payment defaults to "no" if not set
            if (!fetchedData.partial_payment) {
                fetchedData.partial_payment = "no";
            }

            // Ensure first_graduate defaults to "no" if not set
            if (!fetchedData.first_graduate) {
                fetchedData.first_graduate = "no";
            }

            reset(fetchedData);

            // Fetch display names for course and branch
            if (fetchedData.branch_id) {
                const branch_name = await services.getValueFromMaster(
                    "branch_id",
                    fetchedData.branch_id
                );
                if (!branch_name) {
                    setError("Error fetching branch name!");
                } else {
                    setDisplayValues((prev) => ({ ...prev, branch_name: branch_name }));
                }
            }

            if (fetchedData.course_id) {
                const course_name = await services.getValueFromMaster(
                    "course_id",
                    fetchedData.course_id
                );
                if (!course_name) {
                    setError("Error fetching course name!");
                } else {
                    setDisplayValues((prev) => ({ ...prev, course_name: course_name }));
                }
            }

            if (fetchedData.bus_route) {
                const bus_route_name = await services.getValueFromMaster(
                    "bus_route",
                    fetchedData.bus_route
                );
                if (!bus_route_name) {
                    setError("Error fetching route name!");
                } else {
                    setDisplayValues((prev) => ({
                        ...prev,
                        bus_route_name: bus_route_name,
                    }));
                }
            }

            if (getValues("dd_date")) {
                let ddDate = new Date(getValues("dd_date"))
                    .toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                    .replace(/\//g, "-");
                setValue("dd_date", ddDate.toString());
            }

            if (getValues("partial_payment_date")) {
                let partialDate = new Date(getValues("partial_payment_date"))
                    .toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })
                    .replace(/\//g, "-");
                setValue("partial_payment_date", partialDate);
            }

            if (
                getValues("tfc_initial_payment") === null ||
                getValues("tfc_initial_payment") === ""
            ) {
                setValue("tfc_initial_payment", "0");
            } else if (getValues("tfc_initial_payment")) {
                setValue(
                    "tfc_initial_payment",
                    parseInt(getValues("tfc_initial_payment"), 10)
                );
            }
        } catch (error) {
            console.error("Error fetching payment details:", error);
            setError("Error fetching payment details!");
        } finally {
            setIsDefaultValuesFetched(true);
        }
    };

    const getOptions = async () => {
        try {
            setError(null);
            const optionsArray = Object.keys(options);
            const fetchedOptions = await Promise.all(
                optionsArray.map((option) => services.fetchFromMaster(option))
            );
            if (!fetchedOptions[0]) {
                setError("Error fetching options!");
                return;
            }
            const newOptions = {};
            optionsArray.forEach((option, index) => {
                newOptions[option] = fetchedOptions[index];
            });
            setOptions(newOptions);
        } catch (error) {
            console.error("Error fetching options:", error);
            setError("Error fetching options!");
        }
    };
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await getDefaultValues();
                await getOptions();
                await getTotalFees();
            } catch (error) {
                console.error("Error during initialization:", error);
                setError("Error loading payment details!");
            } finally {
                setIsLoading(false);
            }
        };

        if (applicationNo) {
            init();
        } else {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (isDefaultValuesFetched) {
            // Check if there's a valid bus boarding point
            const currentBusPoint = getValues("bus_boarding_point");
            const shouldRequireBus =
                currentBusPoint != null &&
                currentBusPoint !== "" &&
                currentBusPoint !== undefined;

            setBusRequired(shouldRequireBus);
        }
    }, [isDefaultValuesFetched, busBoardingPoint]);

    // Clear all payment method fields when "no fees" is selected
    // This useEffect was causing the issue - it was interfering with the unchecking
    useEffect(() => {
        if (paymentMethods.includes("no fees") && paymentMethods.length > 1) {
            // Clear all payment amounts and details only if other methods are also selected
            setValue("dd_amount", null);
            setValue("dd_bank_name", null);
            setValue("dd_date", null);
            setValue("dd_number", null);
            setValue("card_swipe_amount", null);
            setValue("card_swipe_reference_no", null);
            setValue("online_pay_amount", null);
            setValue("online_pay_reference_no", null);

            // Keep only "no fees" in payment methods
            setValue("fee_payment_option", ["no fees"]);
        }
    }, [paymentMethods, setValue]);

    useEffect(() => {
        const clearBusDetails = async () => {
            if (!busRequired) {
                setValue("bus_boarding_point", null);

                // Update backend to clear bus details
                if (applicationNo) {
                    try {
                        await services.updatePaymentDetails(applicationNo, {
                            bus_boarding_point: null,
                        });
                        await getTotalFees();
                        await getDefaultValues();
                    } catch (error) {
                        console.error("Error clearing bus details:", error);
                        setError("Failed to clear bus details");
                    }
                }
            }
        };

        clearBusDetails();
    }, [busRequired, setValue, applicationNo]);

    // Basic validation function (for save and submit - no fee tallying)
    const validateBasicPaymentData = (data) => {
        const totalAmount = paymentMethods.includes("no fees")
            ? 0
            : (parseFloat(data.dd_amount) || 0) +
            (parseFloat(data.card_swipe_amount) || 0) +
            (parseFloat(data.online_pay_amount) || 0) +
            (parseFloat(data.tfc_initial_payment) || 0);

        // Check if payment methods are selected
        if (!data.fee_payment_option || data.fee_payment_option.length === 0) {
            throw new Error("Please select at least one payment method!");
        }

        // Validate individual payment method fields
        if (paymentMethods.includes("demand draft")) {
            if (!data.dd_amount || parseFloat(data.dd_amount) <= 0) {
                throw new Error("Demand Draft amount is required!");
            }
            if (!data.dd_bank_name) {
                throw new Error("Bank name is required for Demand Draft!");
            }
            if (!data.dd_date) {
                throw new Error("DD Date is required!");
            }
            if (!data.dd_number) {
                throw new Error("DD Number is required!");
            }
        }

        if (paymentMethods.includes("card swiping")) {
            if (!data.card_swipe_amount || parseFloat(data.card_swipe_amount) <= 0) {
                throw new Error("Card Swipe amount is required!");
            }
            if (!data.card_swipe_reference_no) {
                throw new Error("Card Reference Number is required!");
            }
        }

        if (paymentMethods.includes("online payment")) {
            if (!data.online_pay_amount || parseFloat(data.online_pay_amount) <= 0) {
                throw new Error("Online Payment amount is required!");
            }
            if (!data.online_pay_reference_no) {
                throw new Error("Online Reference Number is required!");
            }
        }

        // Validate partial payment date if partial payment is yes
        if (data.partial_payment === "yes" && !data.partial_payment_date) {
            throw new Error(
                "Partial Payment Date is required when partial payment is allowed!"
            );
        }

        return totalAmount;
    };

    // Full validation function (for approve - with fee tallying)
    const validatePaymentDataForApproval = (data) => {
        const totalAmount = paymentMethods.includes("no fees")
            ? 0
            : (parseFloat(data.dd_amount) || 0) +
            (parseFloat(data.card_swipe_amount) || 0) +
            (parseFloat(data.online_pay_amount) || 0) +
            (parseFloat(data.tfc_initial_payment) || 0);

        // Check if payment methods are selected
        if (!data.fee_payment_option || data.fee_payment_option.length === 0) {
            throw new Error("Please select at least one payment method!");
        }

        // If not "no fees", validate payment amounts and tally with total fees
        if (!paymentMethods.includes("no fees")) {
            if (totalAmount <= 0) {
                throw new Error("Total payment amount must be greater than 0!");
            }

            // Check if total amount is sufficient when partial payment is not allowed
            if (data.partial_payment === "no" && totalAmount < feesToPay) {
                throw new Error(
                    `Total amount (₹${totalAmount.toFixed(
                        2
                    )}) is less than required fees (₹${feesToPay.toFixed(
                        2
                    )})! Either increase the payment amount or allow partial payment.`
                );
            }
        }

        // Validate individual payment method fields
        if (paymentMethods.includes("demand draft")) {
            if (!data.dd_amount || parseFloat(data.dd_amount) <= 0) {
                throw new Error("Demand Draft amount is required!");
            }
            if (!data.dd_bank_name) {
                throw new Error("Bank name is required for Demand Draft!");
            }
            if (!data.dd_date) {
                throw new Error("DD Date is required!");
            }
            if (!data.dd_number) {
                throw new Error("DD Number is required!");
            }
        }

        if (paymentMethods.includes("card swiping")) {
            if (!data.card_swipe_amount || parseFloat(data.card_swipe_amount) <= 0) {
                throw new Error("Card Swipe amount is required!");
            }
            if (!data.card_swipe_reference_no) {
                throw new Error("Card Reference Number is required!");
            }
        }

        if (paymentMethods.includes("online payment")) {
            if (!data.online_pay_amount || parseFloat(data.online_pay_amount) <= 0) {
                throw new Error("Online Payment amount is required!");
            }
            if (!data.online_pay_reference_no) {
                throw new Error("Online Reference Number is required!");
            }
        }

        // Validate partial payment date if partial payment is yes
        if (data.partial_payment === "yes" && !data.partial_payment_date) {
            throw new Error(
                "Partial Payment Date is required when partial payment is allowed!"
            );
        }

        return totalAmount;
    };

    const onSave = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            // Use basic validation without fee tallying
            const totalAmount = validateBasicPaymentData(data);

            const submissionData = {
                ...data,
                total_amount: totalAmount,
                // Convert array back to SET format for database
                fee_payment_option: data.fee_payment_option
                    ? data.fee_payment_option.join(",")
                    : "",
            };

            const response = await services.updatePaymentDetails(
                applicationNo,
                submissionData
            );

            if (response) {
                alert("Payment details saved successfully!");
            } else {
                setError("Error saving form!");
            }
        } catch (error) {
            console.error("Error saving payment details:", error);
            setError(error.message || "Error saving form!");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            // Use basic validation without fee tallying
            const totalAmount = validateBasicPaymentData(data);

            const submissionData = {
                ...data,
                total_amount: totalAmount,
                // Convert array back to SET format for database
                fee_payment_option: data.fee_payment_option
                    ? data.fee_payment_option.join(",")
                    : "",
            };

            const response = await services.updatePaymentDetails(
                applicationNo,
                submissionData
            );

            if (response) {
                if (location.state && location.state.fromFinal) {
                    navigate("/final_review");
                } else {
                    navigate("/final_review");
                }
            } else {
                setError("Error submitting form!");
            }
        } catch (error) {
            console.error("Error submitting payment details:", error);
            setError(error.message || "Error submitting form!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = getValues();
            const token_number = data.token_number
                ? parseInt(data.token_number, 10)
                : null;
            if (!token_number) {
                setError("Token number is required for approval!");
                setIsLoading(false);
                return;
            }

            // Use full validation WITH fee tallying for approval
            const totalAmount = validatePaymentDataForApproval(data);

            const submissionData = {
                ...data,
                total_amount: totalAmount,
                approved_by: userName,
                // Convert array back to SET format for database
                fee_payment_option: data.fee_payment_option
                    ? data.fee_payment_option.join(",")
                    : "",
            };

            const response = await services.updatePaymentDetails(
                applicationNo,
                submissionData
            );

            if (response) {
                alert("Payment approved successfully!");
                if (location.state && location.state.fromFinal) {
                    navigate("/final_review");
                } else if (
                    location.state &&
                    location.state.fromPaymentNotVerifiedApplication
                ) {
                    navigate("/incomplete_application");
                } else {
                    navigate("/final_review");
                }
            } else {
                setError("Error approving payment!");
            }
        } catch (error) {
            console.error("Error approving payment:", error);
            setError(error.message || "Error approving payment!");
        } finally {
            setIsLoading(false);
        }
    };

    const paymentMethodOptions = [
        { value: "demand draft", label: "Demand Draft" },
        { value: "card swiping", label: "Card Swiping" },
        { value: "online payment", label: "Online Payment" },
        { value: "no fees", label: "No Fees (Fee exemption)" },
    ];

    const handlePaymentMethodChange = (method) => {
        const currentMethods = getValues("fee_payment_option") || [];

        if (method === "no fees") {
            if (currentMethods.includes("no fees")) {
                // If "no fees" is already selected, unselect it
                setValue("fee_payment_option", []);
            } else {
                // If "no fees" is selected, clear everything else and select only "no fees"
                // Clear payment fields immediately when selecting "no fees"
                setValue("dd_amount", null);
                setValue("dd_bank_name", null);
                setValue("dd_date", null);
                setValue("dd_number", null);
                setValue("card_swipe_amount", null);
                setValue("card_swipe_reference_no", null);
                setValue("online_pay_amount", null);
                setValue("online_pay_reference_no", null);

                setValue("fee_payment_option", ["no fees"]);
            }
        } else {
            // If any other method is selected, remove "no fees"
            let updatedMethods = currentMethods.filter((m) => m !== "no fees");

            if (updatedMethods.includes(method)) {
                // Remove the method if it's already selected
                updatedMethods = updatedMethods.filter((m) => m !== method);
            } else {
                // Add the method if it's not selected
                updatedMethods.push(method);
            }

            setValue("fee_payment_option", updatedMethods);
        }
    };

    const calculateTotalAmount = () => {
        return paymentMethods.includes("no fees")
            ? 0
            : (parseFloat(ddAmount) || 0) +
            (parseFloat(cardAmount) || 0) +
            (parseFloat(onlineAmount) || 0) +
            (parseFloat(tfcInitialPayment) || 0);
    };

    const renderPaymentMethodFields = () => {
        const totalAmount = calculateTotalAmount();
        const isAmountSufficient =
            totalAmount >= feesToPay || partialPayment === "yes";

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
                                    <label
                                        htmlFor={option.value}
                                        className="payment-method-label"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Row>

                {/* Demand Draft Section */}
                {paymentMethods.includes("demand draft") && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">
                            Demand Draft Payment Details
                        </div>
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
                                options={options["bank_name"]}
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
                {paymentMethods.includes("card swiping") && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">
                            Card Swiping Payment Details
                        </div>
                        <Row>
                            <InputField
                                label="Card Swipe Amount"
                                registerProps={register("card_swipe_amount")}
                                type="number"
                                step="0.01"
                                error={
                                    errors.card_swipe_amount && errors.card_swipe_amount.message
                                }
                                required
                            />
                            <InputField
                                label="Card Reference Number"
                                registerProps={register("card_swipe_reference_no")}
                                type="text"
                                error={
                                    errors.card_swipe_reference_no &&
                                    errors.card_swipe_reference_no.message
                                }
                                required
                            />
                        </Row>
                    </div>
                )}

                {/* Online Payment Section */}
                {paymentMethods.includes("online payment") && (
                    <div className="payment-method-section">
                        <div className="payment-method-section-title">
                            Online Payment Details
                        </div>
                        <Row>
                            <InputField
                                label="Online Payment Amount"
                                registerProps={register("online_pay_amount")}
                                type="number"
                                step="0.01"
                                error={
                                    errors.online_pay_amount && errors.online_pay_amount.message
                                }
                                required
                            />
                            <InputField
                                label="Online Reference Number"
                                registerProps={register("online_pay_reference_no")}
                                type="text"
                                error={
                                    errors.online_pay_reference_no &&
                                    errors.online_pay_reference_no.message
                                }
                                required
                            />
                        </Row>
                    </div>
                )}

                {/* Partial Payment Section - Only visible to accounts_manager */}
                <ProtectedComponent users={["accounts_manager"]}>
                    <Row>
                        <DropDown
                            label="Allow Partial Payment"
                            options={{
                                no: "No",
                                yes: "Yes",
                            }}
                            fieldname={"partial_payment"}
                            formcontrol={control}
                            error={errors.partial_payment && errors.partial_payment.message}
                        />

                        {/* Partial Payment Date - Only show if partial payment is "yes" */}
                        {partialPayment === "yes" && (
                            <InputField
                                label="Partial Payment Date"
                                registerProps={register("partial_payment_date")}
                                type="date"
                                error={errors.partial_payment_date && errors.partial_payment_date.message}
                                required
                            />
                        )}
                    </Row>
                </ProtectedComponent>

                {/* No Fees Message */}
                {paymentMethods.includes("no fees") && (
                    <Row>
                        <div className="no-fees-message">
                            <div className="no-fees-text">
                                Fee exemption selected - No payment required
                            </div>
                        </div>
                    </Row>
                )}
                {/* Fee Breakdown Display */}
                {paymentMethods.length > 0 && !paymentMethods.includes("no fees") && (
                    <div className="fee-breakdown-section">
                        <Row>
                            <div className="fee-breakdown-display">
                                <div className="fee-breakdown-title">Fee Breakdown:</div>
                                <div className="fee-breakdown-items">
                                    {feeBreakdown.total_fee > 0 && (
                                        <div className="fee-breakdown-item">
                                            <span className="fee-label">Total Fee:</span>
                                            <span className="fee-amount">
                                                ₹{feeBreakdown.total_fee.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {feeBreakdown.bus_fee > 0 && (
                                        <div className="fee-breakdown-item">
                                            <span className="fee-label">Bus Fee:</span>
                                            <span className="fee-amount">
                                                ₹{feeBreakdown.bus_fee.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {feeBreakdown.first_graduate > 0 &&
                                        first_graduate === "yes" && (
                                            <div className="fee-breakdown-item">
                                                <span className="fee-label">First Graduate Fee:</span>
                                                <span className="fee-amount">
                                                    ₹{feeBreakdown.first_graduate.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </Row>
                    </div>
                )}

                {/* Fees To Pay and Total Amount Display */}
                {paymentMethods.length > 0 && !paymentMethods.includes("no fees") && (
                    <div className="payment-summary-section">
                        <Row>
                            <div className="fees-to-pay-display">
                                <div className="fees-to-pay-text">
                                    Fees to be Paid: ₹{feesToPay.toFixed(2)}
                                </div>
                            </div>
                            <div
                                className={`total-amount-display ${isAmountSufficient ? "sufficient" : "insufficient"
                                    }`}
                            >
                                <div className="total-amount-text">
                                    Total Amount: ₹{totalAmount.toFixed(2)}
                                </div>
                                {!isAmountSufficient && (
                                    <div className="insufficient-amount-warning">
                                        Note: Amount will be validated during approval. Enable
                                        partial payment if needed.
                                    </div>
                                )}
                            </div>
                        </Row>
                    </div>
                )}

                {/* Save and Approve Button Section */}
                <Row>
                    <div className="button-container">
                        <button
                            type="button"
                            onClick={handleSubmit(onSave)}
                            className="save-button"
                            disabled={isLoading}
                        >
                            Save Details
                        </button>

                        {/* Approve Button - Only visible to admin, manager, accounts_manager */}
                        <ProtectedComponent
                            users={["admin", "manager", "accounts_manager"]}
                        >
                            <button
                                type="button"
                                onClick={handleApprove}
                                className="approve-button"
                                disabled={isLoading}
                            >
                                Approve Payment
                            </button>
                        </ProtectedComponent>
                    </div>
                </Row>
            </div>
        );
    };

    return (
        <div className="payment-details-container">
            {isLoading && <Loading />}
            {error && <Error message={error} />}
            <Form
                handleNext={handleSubmit(onSubmit)}
                heading="Payment Details"
                handleBack={() => {
                    navigate("/additional_details");
                }}
            >
                {/* Student Details Section */}
                <div className="student-details-section">
                    <h3>Student Details</h3>
                    <Row>
                        <InputField
                            label="Pre Student Register SNO"
                            registerProps={register("pre_student_register_sno")}
                            type="text"
                            readOnly={true}
                            error={
                                errors.pre_student_register_sno &&
                                errors.pre_student_register_sno.message
                            }
                        />
                        <InputField
                            label="Application ID"
                            registerProps={register("application_id")}
                            type="text"
                            readOnly={true}
                            error={errors.application_id && errors.application_id.message}
                        />
                        <InputField
                            label="Seat Category"
                            registerProps={register("seat_category")}
                            type="text"
                            readOnly={true}
                            error={errors.seat_category && errors.seat_category.message}
                        />
                    </Row>
                    <Row>
                        <InputField
                            label="Year"
                            registerProps={register("year")}
                            type="text"
                            readOnly={true}
                            error={errors.year && errors.year.message}
                        />
                        <InputField
                            label="Course"
                            registerProps={{ value: displayValues.course_name || "" }}
                            type="text"
                            readOnly={true}
                        />
                        <InputField
                            label="Branch"
                            registerProps={{ value: displayValues.branch_name || "" }}
                            type="text"
                            readOnly={true}
                        />
                    </Row>
                    <Row>
                        <InputField
                            label="Student Name"
                            registerProps={register("student_name")}
                            type="text"
                            readOnly={true}
                            error={errors.student_name && errors.student_name.message}
                        />
                        <InputField
                            label="Mobile Number"
                            registerProps={register("mobile_number")}
                            type="tel"
                            readOnly={true}
                            error={errors.mobile_number && errors.mobile_number.message}
                        />
                        <InputField
                            label="Scholar"
                            registerProps={register("scholar")}
                            type="text"
                            readOnly={true}
                            error={errors.scholar && errors.scholar.message}
                        />
                    </Row>
                    <Row>
                        <DropDown
                            label="First Graduate"
                            options={{
                                no: "No",
                                yes: "Yes",
                            }}
                            fieldname={"first_graduate"}
                            formcontrol={control}
                            error={errors.first_graduate && errors.first_graduate.message}
                        />
                    </Row>
                </div>

                <hr />

                {/* Payment Details Section */}
                <Row>
                    <ProtectedComponent users={["admin", "manager", "accounts_manager"]}>
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
                        options={{ 0: "0", 5000: "5000", 25000: "25000", 300000: "300000" }}
                        fieldname={"tfc_initial_payment"}
                        formcontrol={control}
                        error={
                            errors.tfc_initial_payment && errors.tfc_initial_payment.message
                        }
                        required
                    />
                </Row>

                <Row>
                    <div className="bus-confirmation">
                        <label>
                            <input
                                type="checkbox"
                                checked={busRequired}
                                onChange={(e) => setBusRequired(e.target.checked)}
                            />
                            Bus Required
                        </label>
                    </div>
                </Row>

                {/* Only show bus details if bus is confirmed as needed */}
                {busRequired && (
                    <Row>
                        <DropDown
                            label="Bus Boarding Point"
                            options={options["boarding_point"]}
                            fieldname={"bus_boarding_point"}
                            formcontrol={control}
                            error={
                                errors.bus_boarding_point && errors.bus_boarding_point.message
                            }
                        />
                        <InputField
                            label="Bus Route"
                            registerProps={{ value: displayValues.bus_route_name || "" }}
                            type="text"
                            readOnly={true}
                        />
                    </Row>
                )}

                <div className="payment-methods-section">
                    <div className="payment-methods-title">Payment Method Selection</div>
                    {renderPaymentMethodFields()}
                </div>
            </Form>
        </div>
    );
}

export default PaymentDetails;
