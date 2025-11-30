/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

/**
 * Shared types for Chart components.
 *
 * @remarks
 * These types are shared across multiple chart components (Area, Bar, Line, etc.)
 * and provide common configuration options for series, axes, and styling.
 *
 * @packageDocumentation
 */

import {
    type SubtypeExprOrValue,
    OptionType,
    StructType,
    ArrayType,
    StringType,
    FloatType,
    BooleanType,
    VariantType,
    NullType,
    IntegerType,
    type ExprType,
    variant,
    some,
    none,
    East,
} from "@elaraai/east";

// ============================================================================
// Chart Series Type
// ============================================================================

/**
 * Series configuration for multi-series charts.
 *
 * @remarks
 * Mirrors Chakra's useChart series config. Each series represents a data
 * dimension to be visualized (e.g., "revenue", "profit").
 *
 * @property name - Data key name (matches keys in data points)
 * @property color - Chakra color token (e.g., "teal.solid", "blue.500")
 * @property stackId - Stack group ID (same stackId = stacked together)
 * @property label - Display label (defaults to name)
 * @property stroke - Stroke/line color (defaults to color)
 * @property strokeWidth - Stroke/line width in pixels
 * @property fill - Fill color (defaults to color)
 * @property fillOpacity - Fill opacity (0-1)
 * @property strokeDasharray - Dash pattern for dashed lines (e.g., "5 5")
 */
export const ChartSeriesType = StructType({
    name: StringType,
    color: OptionType(StringType),
    stackId: OptionType(StringType),
    label: OptionType(StringType),
    stroke: OptionType(StringType),
    strokeWidth: OptionType(IntegerType),
    fill: OptionType(StringType),
    fillOpacity: OptionType(FloatType),
    strokeDasharray: OptionType(StringType),
});

/**
 * Type representing chart series configuration.
 */
export type ChartSeriesType = typeof ChartSeriesType;

/**
 * TypeScript interface for chart series configuration.
 */
export interface ChartSeries {
    /** Data key name (matches keys in data points) */
    name?: SubtypeExprOrValue<StringType>;
    /** Chakra color token (e.g., "teal.solid", "blue.500") */
    color?: SubtypeExprOrValue<StringType>;
    /** Stack group ID (same stackId = stacked together) */
    stackId?: SubtypeExprOrValue<StringType>;
    /** Display label (defaults to name) */
    label?: SubtypeExprOrValue<StringType>;
    /** Stroke/line color (defaults to color) */
    stroke?: SubtypeExprOrValue<StringType>;
    /** Stroke/line width in pixels */
    strokeWidth?: SubtypeExprOrValue<IntegerType>;
    /** Fill color (defaults to color) */
    fill?: SubtypeExprOrValue<StringType>;
    /** Fill opacity (0-1) */
    fillOpacity?: SubtypeExprOrValue<FloatType>;
    /** Dash pattern for dashed lines (e.g., "5 5") */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
}

export function ChartSeries(series: ChartSeries): ExprType<ChartSeriesType> {
    return East.value({
        name: series.name as string,
        color: series.color !== undefined ? some(series.color) : none,
        stackId: series.stackId !== undefined ? some(series.stackId) : none,
        label: series.label !== undefined ? some(series.label) : none,
        stroke: series.stroke !== undefined ? some(series.stroke) : none,
        strokeWidth: series.strokeWidth !== undefined ? some(series.strokeWidth) : none,
        fill: series.fill !== undefined ? some(series.fill) : none,
        fillOpacity: series.fillOpacity !== undefined ? some(series.fillOpacity) : none,
        strokeDasharray: series.strokeDasharray !== undefined ? some(series.strokeDasharray) : none,
    }, ChartSeriesType);
}

// ============================================================================
// Sort Direction Type
// ============================================================================

/**
 * Sort direction for BarList and BarSegment sorting.
 *
 * @property asc - Ascending order (smallest to largest)
 * @property desc - Descending order (largest to smallest)
 */
export const ChartSortDirectionType = VariantType({
    asc: NullType,
    desc: NullType,
});

/**
 * Type representing chart sort direction.
 */
export type ChartSortDirectionType = typeof ChartSortDirectionType;

/**
 * String literal type for sort direction values.
 */
export type ChartSortDirectionLiteral = "asc" | "desc";


// ============================================================================
// Sort Type
// ============================================================================

/**
 * Sort configuration for BarList and BarSegment.
 *
 * @property by - Data key to sort by
 * @property direction - Sort direction (asc or desc)
 */
export const ChartSortType = StructType({
    by: StringType,
    direction: ChartSortDirectionType,
});

/**
 * Type representing chart sort configuration.
 */
export type ChartSortType = typeof ChartSortType;

/**
 * TypeScript interface for chart sort configuration.
 */
export interface ChartSort {
    /** Data key to sort by */
    by: SubtypeExprOrValue<StringType>;
    /** Sort direction */
    direction: SubtypeExprOrValue<ChartSortDirectionType> | ChartSortDirectionLiteral;
}

export function ChartSort(sort: ChartSort): ExprType<ChartSortType> {
    return East.value({
        by: sort.by,
        direction: typeof sort.direction === "string"
            ? variant(sort.direction, null)
            : sort.direction,
    }, ChartSortType);
}

// ============================================================================
// Tick Format Supporting Types
// ============================================================================

/**
 * Compact display style for number formatting.
 *
 * @property short - Short notation (1K, 1M, 1B)
 * @property long - Long notation (1 thousand, 1 million)
 */
export const CompactDisplayType = VariantType({
    short: NullType,
    long: NullType,
});
export type CompactDisplayType = typeof CompactDisplayType;
export type CompactDisplayLiteral = "short" | "long";

/**
 * Currency display style.
 *
 * @property code - ISO code (USD, EUR)
 * @property symbol - Currency symbol ($, €)
 * @property narrowSymbol - Narrow symbol variant
 * @property name - Full name (US dollars)
 */
export const CurrencyDisplayType = VariantType({
    code: NullType,
    symbol: NullType,
    narrowSymbol: NullType,
    name: NullType,
});
export type CurrencyDisplayType = typeof CurrencyDisplayType;
export type CurrencyDisplayLiteral = "code" | "symbol" | "narrowSymbol" | "name";

/**
 * Unit display style.
 *
 * @property short - Short form (16 l)
 * @property narrow - Narrow form (16l)
 * @property long - Long form (16 liters)
 */
export const UnitDisplayType = VariantType({
    short: NullType,
    narrow: NullType,
    long: NullType,
});
export type UnitDisplayType = typeof UnitDisplayType;
export type UnitDisplayLiteral = "short" | "narrow" | "long";

/**
 * Sign display style for numbers.
 *
 * @property auto - Sign for negative only (default)
 * @property never - Never show sign
 * @property always - Always show sign
 * @property exceptZero - Show sign except for zero
 */
export const SignDisplayType = VariantType({
    auto: NullType,
    never: NullType,
    always: NullType,
    exceptZero: NullType,
});
export type SignDisplayType = typeof SignDisplayType;
export type SignDisplayLiteral = "auto" | "never" | "always" | "exceptZero";

/**
 * Date/time style for Intl.DateTimeFormat.
 *
 * @property full - Full format (Wednesday, March 15, 2024)
 * @property long - Long format (March 15, 2024)
 * @property medium - Medium format (Mar 15, 2024)
 * @property short - Short format (3/15/24)
 */
export const DateTimeStyleType = VariantType({
    full: NullType,
    long: NullType,
    medium: NullType,
    short: NullType,
});
export type DateTimeStyleType = typeof DateTimeStyleType;
export type DateTimeStyleLiteral = "full" | "long" | "medium" | "short";

/**
 * ISO 4217 currency codes.
 *
 * @remarks
 * Common currencies supported by Intl.NumberFormat.
 *
 * Major currencies:
 * @property USD - US Dollar
 * @property EUR - Euro
 * @property GBP - British Pound
 * @property JPY - Japanese Yen
 * @property CHF - Swiss Franc
 * @property CAD - Canadian Dollar
 * @property AUD - Australian Dollar
 * @property NZD - New Zealand Dollar
 *
 * Asian currencies:
 * @property CNY - Chinese Yuan
 * @property HKD - Hong Kong Dollar
 * @property SGD - Singapore Dollar
 * @property KRW - South Korean Won
 * @property INR - Indian Rupee
 * @property TWD - Taiwan Dollar
 * @property THB - Thai Baht
 * @property MYR - Malaysian Ringgit
 * @property IDR - Indonesian Rupiah
 * @property PHP - Philippine Peso
 * @property VND - Vietnamese Dong
 *
 * European currencies:
 * @property SEK - Swedish Krona
 * @property NOK - Norwegian Krone
 * @property DKK - Danish Krone
 * @property PLN - Polish Zloty
 * @property CZK - Czech Koruna
 * @property HUF - Hungarian Forint
 * @property RUB - Russian Ruble
 * @property UAH - Ukrainian Hryvnia
 * @property RON - Romanian Leu
 *
 * Americas currencies:
 * @property MXN - Mexican Peso
 * @property BRL - Brazilian Real
 * @property ARS - Argentine Peso
 * @property CLP - Chilean Peso
 * @property COP - Colombian Peso
 * @property PEN - Peruvian Sol
 *
 * Middle East/Africa currencies:
 * @property AED - UAE Dirham
 * @property SAR - Saudi Riyal
 * @property ILS - Israeli Shekel
 * @property ZAR - South African Rand
 * @property TRY - Turkish Lira
 * @property EGP - Egyptian Pound
 * @property NGN - Nigerian Naira
 * @property KES - Kenyan Shilling
 */
export const CurrencyCodeType = VariantType({
    // Major
    USD: NullType,
    EUR: NullType,
    GBP: NullType,
    JPY: NullType,
    CHF: NullType,
    CAD: NullType,
    AUD: NullType,
    NZD: NullType,
    // Asia
    CNY: NullType,
    HKD: NullType,
    SGD: NullType,
    KRW: NullType,
    INR: NullType,
    TWD: NullType,
    THB: NullType,
    MYR: NullType,
    IDR: NullType,
    PHP: NullType,
    VND: NullType,
    // Europe
    SEK: NullType,
    NOK: NullType,
    DKK: NullType,
    PLN: NullType,
    CZK: NullType,
    HUF: NullType,
    RUB: NullType,
    UAH: NullType,
    RON: NullType,
    // Americas
    MXN: NullType,
    BRL: NullType,
    ARS: NullType,
    CLP: NullType,
    COP: NullType,
    PEN: NullType,
    // Middle East/Africa
    AED: NullType,
    SAR: NullType,
    ILS: NullType,
    ZAR: NullType,
    TRY: NullType,
    EGP: NullType,
    NGN: NullType,
    KES: NullType,
});
export type CurrencyCodeType = typeof CurrencyCodeType;
export type CurrencyCodeLiteral =
    | "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "CAD" | "AUD" | "NZD"
    | "CNY" | "HKD" | "SGD" | "KRW" | "INR" | "TWD" | "THB" | "MYR" | "IDR" | "PHP" | "VND"
    | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RUB" | "UAH" | "RON"
    | "MXN" | "BRL" | "ARS" | "CLP" | "COP" | "PEN"
    | "AED" | "SAR" | "ILS" | "ZAR" | "TRY" | "EGP" | "NGN" | "KES";

/**
 * Unit types supported by Intl.NumberFormat.
 *
 * @remarks
 * Standard units from the CLDR specification.
 *
 * Digital/Data:
 * @property bit - Bits
 * @property byte - Bytes
 * @property kilobit - Kilobits
 * @property kilobyte - Kilobytes
 * @property megabit - Megabits
 * @property megabyte - Megabytes
 * @property gigabit - Gigabits
 * @property gigabyte - Gigabytes
 * @property terabit - Terabits
 * @property terabyte - Terabytes
 * @property petabyte - Petabytes
 *
 * Duration:
 * @property nanosecond - Nanoseconds
 * @property microsecond - Microseconds
 * @property millisecond - Milliseconds
 * @property second - Seconds
 * @property minute - Minutes
 * @property hour - Hours
 * @property day - Days
 * @property week - Weeks
 * @property month - Months
 * @property year - Years
 *
 * Length:
 * @property millimeter - Millimeters
 * @property centimeter - Centimeters
 * @property meter - Meters
 * @property kilometer - Kilometers
 * @property inch - Inches
 * @property foot - Feet
 * @property yard - Yards
 * @property mile - Miles
 *
 * Mass:
 * @property gram - Grams
 * @property kilogram - Kilograms
 * @property milligram - Milligrams
 * @property ounce - Ounces
 * @property pound - Pounds
 * @property stone - Stones
 *
 * Temperature:
 * @property celsius - Celsius
 * @property fahrenheit - Fahrenheit
 *
 * Volume:
 * @property milliliter - Milliliters
 * @property liter - Liters
 * @property gallon - Gallons
 * @property fluidOunce - Fluid ounces
 *
 * Area:
 * @property acre - Acres
 * @property hectare - Hectares
 *
 * Speed:
 * @property meterPerSecond - Meters per second
 * @property kilometerPerHour - Kilometers per hour
 * @property milePerHour - Miles per hour
 *
 * Other:
 * @property percent - Percentage
 * @property degree - Degrees (angle)
 */
export const UnitType = VariantType({
    // Digital
    bit: NullType,
    byte: NullType,
    kilobit: NullType,
    kilobyte: NullType,
    megabit: NullType,
    megabyte: NullType,
    gigabit: NullType,
    gigabyte: NullType,
    terabit: NullType,
    terabyte: NullType,
    petabyte: NullType,
    // Duration
    nanosecond: NullType,
    microsecond: NullType,
    millisecond: NullType,
    second: NullType,
    minute: NullType,
    hour: NullType,
    day: NullType,
    week: NullType,
    month: NullType,
    year: NullType,
    // Length
    millimeter: NullType,
    centimeter: NullType,
    meter: NullType,
    kilometer: NullType,
    inch: NullType,
    foot: NullType,
    yard: NullType,
    mile: NullType,
    // Mass
    gram: NullType,
    kilogram: NullType,
    milligram: NullType,
    ounce: NullType,
    pound: NullType,
    stone: NullType,
    // Temperature
    celsius: NullType,
    fahrenheit: NullType,
    // Volume
    milliliter: NullType,
    liter: NullType,
    gallon: NullType,
    fluidOunce: NullType,
    // Area
    acre: NullType,
    hectare: NullType,
    // Speed
    meterPerSecond: NullType,
    kilometerPerHour: NullType,
    milePerHour: NullType,
    // Other
    percent: NullType,
    degree: NullType,
});
export type UnitType = typeof UnitType;
export type UnitLiteral =
    | "bit" | "byte" | "kilobit" | "kilobyte" | "megabit" | "megabyte" | "gigabit" | "gigabyte" | "terabit" | "terabyte" | "petabyte"
    | "nanosecond" | "microsecond" | "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year"
    | "millimeter" | "centimeter" | "meter" | "kilometer" | "inch" | "foot" | "yard" | "mile"
    | "gram" | "kilogram" | "milligram" | "ounce" | "pound" | "stone"
    | "celsius" | "fahrenheit"
    | "milliliter" | "liter" | "gallon" | "fluidOunce"
    | "acre" | "hectare"
    | "meterPerSecond" | "kilometerPerHour" | "milePerHour"
    | "percent" | "degree";

// ============================================================================
// Tick Format Type
// ============================================================================

/**
 * Number format configuration.
 *
 * @property minimumFractionDigits - Minimum decimal places
 * @property maximumFractionDigits - Maximum decimal places
 * @property signDisplay - How to display sign
 */
export const NumberFormatType = StructType({
    minimumFractionDigits: OptionType(IntegerType),
    maximumFractionDigits: OptionType(IntegerType),
    signDisplay: OptionType(SignDisplayType),
});
export type NumberFormatType = typeof NumberFormatType;

/**
 * Currency format configuration.
 *
 * @property currency - ISO 4217 currency code
 * @property display - How to display the currency
 * @property minimumFractionDigits - Minimum decimal places
 * @property maximumFractionDigits - Maximum decimal places
 */
export const CurrencyFormatType = StructType({
    currency: CurrencyCodeType,
    display: OptionType(CurrencyDisplayType),
    minimumFractionDigits: OptionType(IntegerType),
    maximumFractionDigits: OptionType(IntegerType),
});
export type CurrencyFormatType = typeof CurrencyFormatType;

/**
 * Percent format configuration.
 *
 * @property minimumFractionDigits - Minimum decimal places
 * @property maximumFractionDigits - Maximum decimal places
 * @property signDisplay - How to display sign
 */
export const PercentFormatType = StructType({
    minimumFractionDigits: OptionType(IntegerType),
    maximumFractionDigits: OptionType(IntegerType),
    signDisplay: OptionType(SignDisplayType),
});
export type PercentFormatType = typeof PercentFormatType;

/**
 * Compact notation format configuration.
 *
 * @property display - Short (1K) or long (1 thousand)
 */
export const CompactFormatType = StructType({
    display: OptionType(CompactDisplayType),
});
export type CompactFormatType = typeof CompactFormatType;

/**
 * Unit format configuration.
 *
 * @property unit - The unit to format
 * @property display - How to display the unit
 */
export const UnitFormatType = StructType({
    unit: UnitType,
    display: OptionType(UnitDisplayType),
});
export type UnitFormatType = typeof UnitFormatType;

/**
 * Date format configuration.
 *
 * @property style - Date style (full, long, medium, short)
 */
export const DateFormatType = StructType({
    style: OptionType(DateTimeStyleType),
});
export type DateFormatType = typeof DateFormatType;

/**
 * Time format configuration.
 *
 * @property style - Time style (full, long, medium, short)
 * @property hour12 - Use 12-hour format (true) or 24-hour format (false)
 */
export const TimeFormatType = StructType({
    style: OptionType(DateTimeStyleType),
    hour12: OptionType(BooleanType),
});
export type TimeFormatType = typeof TimeFormatType;

/**
 * DateTime format configuration.
 *
 * @property dateStyle - Date style
 * @property timeStyle - Time style
 * @property hour12 - Use 12-hour format
 */
export const DateTimeFormatType = StructType({
    dateStyle: OptionType(DateTimeStyleType),
    timeStyle: OptionType(DateTimeStyleType),
    hour12: OptionType(BooleanType),
});
export type DateTimeFormatType = typeof DateTimeFormatType;

/**
 * Tick format for axis values.
 *
 * @remarks
 * Comprehensive formatting options based on Intl.NumberFormat and Intl.DateTimeFormat.
 * Each variant contains configuration specific to that format type.
 *
 * Number formats:
 * @property number - Plain number with optional decimal/sign configuration
 * @property currency - Currency format with code and display options
 * @property percent - Percentage with decimal configuration
 * @property compact - Compact notation (1K, 1M) with short/long display
 * @property unit - Unit formatting (bytes, meters, etc.)
 * @property scientific - Scientific notation (1.23e+4)
 * @property engineering - Engineering notation (12.3e+3)
 *
 * Date/Time formats:
 * @property date - Date formatting with style
 * @property time - Time formatting with style and 12/24 hour
 * @property datetime - Combined date and time
 */
export const TickFormatType = VariantType({
    // Number formats
    number: NumberFormatType,
    currency: CurrencyFormatType,
    percent: PercentFormatType,
    compact: CompactFormatType,
    unit: UnitFormatType,
    scientific: NullType,
    engineering: NullType,
    // Date/Time formats
    date: DateFormatType,
    time: TimeFormatType,
    datetime: DateTimeFormatType,
});

/**
 * Type representing tick format.
 */
export type TickFormatType = typeof TickFormatType;

// ============================================================================
// Tick Format Helper Interfaces
// ============================================================================

export interface NumberFormat {
    minimumFractionDigits?: SubtypeExprOrValue<IntegerType>;
    maximumFractionDigits?: SubtypeExprOrValue<IntegerType>;
    signDisplay?: SubtypeExprOrValue<SignDisplayType> | SignDisplayLiteral;
}

export interface CurrencyFormat {
    currency: SubtypeExprOrValue<CurrencyCodeType> | CurrencyCodeLiteral;
    display?: SubtypeExprOrValue<CurrencyDisplayType> | CurrencyDisplayLiteral;
    minimumFractionDigits?: SubtypeExprOrValue<IntegerType>;
    maximumFractionDigits?: SubtypeExprOrValue<IntegerType>;
}

export interface PercentFormat {
    minimumFractionDigits?: SubtypeExprOrValue<IntegerType>;
    maximumFractionDigits?: SubtypeExprOrValue<IntegerType>;
    signDisplay?: SubtypeExprOrValue<SignDisplayType> | SignDisplayLiteral;
}

export interface CompactFormat {
    display?: SubtypeExprOrValue<CompactDisplayType> | CompactDisplayLiteral;
}

export interface UnitFormat {
    unit: SubtypeExprOrValue<UnitType> | UnitLiteral;
    display?: SubtypeExprOrValue<UnitDisplayType> | UnitDisplayLiteral;
}

export interface DateFormat {
    style?: SubtypeExprOrValue<DateTimeStyleType> | DateTimeStyleLiteral;
}

export interface TimeFormat {
    style?: SubtypeExprOrValue<DateTimeStyleType> | DateTimeStyleLiteral;
    hour12?: SubtypeExprOrValue<BooleanType>;
}

export interface DateTimeFormat {
    dateStyle?: SubtypeExprOrValue<DateTimeStyleType> | DateTimeStyleLiteral;
    timeStyle?: SubtypeExprOrValue<DateTimeStyleType> | DateTimeStyleLiteral;
    hour12?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Tick Format Helper Functions
// ============================================================================

/**
 * Creates a number tick format for axis values.
 *
 * @param format - Optional configuration for number formatting
 * @param format.minimumFractionDigits - Minimum number of decimal places to display
 * @param format.maximumFractionDigits - Maximum number of decimal places to display
 * @param format.signDisplay - How to display the sign: "auto" (negative only), "never", "always", or "exceptZero"
 * @returns An East expression representing the number tick format
 *
 * @remarks
 * Uses Intl.NumberFormat under the hood. When called without arguments,
 * uses default number formatting.
 *
 * @example
 * ```ts
 * // Default number format
 * Chart.Axis({ tickFormat: TickFormat.Number() })
 *
 * // Fixed 2 decimal places
 * Chart.Axis({ tickFormat: TickFormat.Number({ minimumFractionDigits: 2n, maximumFractionDigits: 2n }) })
 *
 * // Always show sign (+/-)
 * Chart.Axis({ tickFormat: TickFormat.Number({ signDisplay: "always" }) })
 * ```
 */
export function NumberTickFormat(format?: NumberFormat): ExprType<TickFormatType> {
    return East.value(variant("number", {
        minimumFractionDigits: format?.minimumFractionDigits !== undefined
            ? some(format.minimumFractionDigits) : none,
        maximumFractionDigits: format?.maximumFractionDigits !== undefined
            ? some(format.maximumFractionDigits) : none,
        signDisplay: format?.signDisplay !== undefined
            ? some(typeof format.signDisplay === "string" ? variant(format.signDisplay, null) : format.signDisplay)
            : none,
    }), TickFormatType);
}

/**
 * Creates a currency tick format for axis values.
 *
 * @param format - Configuration for currency formatting (required)
 * @param format.currency - ISO 4217 currency code (e.g., "USD", "EUR", "GBP", "JPY")
 * @param format.display - How to display the currency: "symbol" ($), "narrowSymbol", "code" (USD), or "name" (US Dollar)
 * @param format.minimumFractionDigits - Minimum decimal places (default varies by currency)
 * @param format.maximumFractionDigits - Maximum decimal places
 * @returns An East expression representing the currency tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with style "currency". The currency parameter is required
 * as there is no sensible default. Supports 40+ common ISO 4217 currency codes.
 *
 * @example
 * ```ts
 * // US Dollars with symbol ($1,234.56)
 * Chart.Axis({ tickFormat: TickFormat.Currency({ currency: "USD" }) })
 *
 * // Euros with currency code (EUR 1.234,56)
 * Chart.Axis({ tickFormat: TickFormat.Currency({ currency: "EUR", display: "code" }) })
 *
 * // Japanese Yen with no decimals (¥1,235)
 * Chart.Axis({ tickFormat: TickFormat.Currency({ currency: "JPY", maximumFractionDigits: 0n }) })
 * ```
 */
export function CurrencyTickFormat(format: CurrencyFormat): ExprType<TickFormatType> {
    const currencyValue = typeof format.currency === "string"
        ? East.value(variant(format.currency as any, null), CurrencyCodeType)
        : format.currency;

    const displayValue = format.display !== undefined
        ? (typeof format.display === "string"
            ? East.value(variant(format.display, null), CurrencyDisplayType)
            : format.display)
        : undefined;

    return East.value(variant("currency", {
        currency: currencyValue,
        display: displayValue ? some(displayValue) : none,
        minimumFractionDigits: format.minimumFractionDigits !== undefined
            ? some(format.minimumFractionDigits) : none,
        maximumFractionDigits: format.maximumFractionDigits !== undefined
            ? some(format.maximumFractionDigits) : none,
    }), TickFormatType);
}

/**
 * Creates a percent tick format for axis values.
 *
 * @param format - Optional configuration for percent formatting
 * @param format.minimumFractionDigits - Minimum decimal places after the percent
 * @param format.maximumFractionDigits - Maximum decimal places after the percent
 * @param format.signDisplay - How to display the sign: "auto", "never", "always", or "exceptZero"
 * @returns An East expression representing the percent tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with style "percent". Input values should be decimals
 * (e.g., 0.5 for 50%). The formatter multiplies by 100 and adds the % symbol.
 *
 * @example
 * ```ts
 * // Default percent format (50%)
 * Chart.Axis({ tickFormat: TickFormat.Percent() })
 *
 * // Percent with 1 decimal place (50.0%)
 * Chart.Axis({ tickFormat: TickFormat.Percent({ minimumFractionDigits: 1n }) })
 *
 * // Always show sign (+50%, -25%)
 * Chart.Axis({ tickFormat: TickFormat.Percent({ signDisplay: "always" }) })
 * ```
 */
export function PercentTickFormat(format?: PercentFormat): ExprType<TickFormatType> {
    return East.value(variant("percent", {
        minimumFractionDigits: format?.minimumFractionDigits !== undefined
            ? some(format.minimumFractionDigits) : none,
        maximumFractionDigits: format?.maximumFractionDigits !== undefined
            ? some(format.maximumFractionDigits) : none,
        signDisplay: format?.signDisplay !== undefined
            ? some(typeof format.signDisplay === "string" ? variant(format.signDisplay, null) : format.signDisplay)
            : none,
    }), TickFormatType);
}

/**
 * Creates a compact notation tick format for axis values.
 *
 * @param format - Optional configuration for compact formatting
 * @param format.display - Display style: "short" (1K, 1M, 1B) or "long" (1 thousand, 1 million)
 * @returns An East expression representing the compact tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with notation "compact". Ideal for large numbers
 * where full precision isn't needed. Automatically abbreviates thousands (K),
 * millions (M), billions (B), etc.
 *
 * @example
 * ```ts
 * // Default compact format (1K, 1M, 1B)
 * Chart.Axis({ tickFormat: TickFormat.Compact() })
 *
 * // Short display (1K, 1M)
 * Chart.Axis({ tickFormat: TickFormat.Compact({ display: "short" }) })
 *
 * // Long display (1 thousand, 1 million)
 * Chart.Axis({ tickFormat: TickFormat.Compact({ display: "long" }) })
 * ```
 */
export function CompactTickFormat(format?: CompactFormat): ExprType<TickFormatType> {
    return East.value(variant("compact", {
        display: format?.display !== undefined
            ? some(typeof format.display === "string" ? variant(format.display, null) : format.display)
            : none,
    }), TickFormatType);
}

/**
 * Creates a unit tick format for axis values.
 *
 * @param format - Configuration for unit formatting (required)
 * @param format.unit - The unit to format. Supports digital (byte, kilobyte, gigabyte),
 *   duration (second, minute, hour, day), length (meter, kilometer, mile),
 *   mass (gram, kilogram, pound), temperature (celsius, fahrenheit),
 *   volume (liter, gallon), speed (meterPerSecond, kilometerPerHour), and more
 * @param format.display - How to display the unit: "short" (10 km), "narrow" (10km), or "long" (10 kilometers)
 * @returns An East expression representing the unit tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with style "unit". The unit parameter is required.
 * Supports all CLDR unit identifiers available in modern browsers.
 *
 * @example
 * ```ts
 * // File sizes in gigabytes (10 GB)
 * Chart.Axis({ tickFormat: TickFormat.Unit({ unit: "gigabyte" }) })
 *
 * // Distance in kilometers, narrow display (10km)
 * Chart.Axis({ tickFormat: TickFormat.Unit({ unit: "kilometer", display: "narrow" }) })
 *
 * // Temperature in Celsius, long display (25 degrees Celsius)
 * Chart.Axis({ tickFormat: TickFormat.Unit({ unit: "celsius", display: "long" }) })
 *
 * // Speed in km/h
 * Chart.Axis({ tickFormat: TickFormat.Unit({ unit: "kilometerPerHour", display: "short" }) })
 * ```
 */
export function UnitTickFormat(format: UnitFormat): ExprType<TickFormatType> {
    const unitValue = typeof format.unit === "string"
        ? East.value(variant(format.unit as any, null), UnitType)
        : format.unit;

    const displayValue = format.display !== undefined
        ? (typeof format.display === "string"
            ? East.value(variant(format.display, null), UnitDisplayType)
            : format.display)
        : undefined;

    return East.value(variant("unit", {
        unit: unitValue,
        display: displayValue ? some(displayValue) : none,
    }), TickFormatType);
}

/**
 * Creates a scientific notation tick format for axis values.
 *
 * @returns An East expression representing the scientific notation tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with notation "scientific". Displays numbers in
 * scientific notation (e.g., 1.23E4 for 12300). Useful for very large or
 * very small numbers in scientific contexts.
 *
 * @example
 * ```ts
 * // Scientific notation (1.23E4, 5.67E-3)
 * Chart.Axis({ tickFormat: TickFormat.Scientific() })
 * // Or using string literal:
 * Chart.Axis({ tickFormat: "scientific" })
 * ```
 */
export function ScientificTickFormat(): ExprType<TickFormatType> {
    return East.value(variant("scientific", null), TickFormatType);
}

/**
 * Creates an engineering notation tick format for axis values.
 *
 * @returns An East expression representing the engineering notation tick format
 *
 * @remarks
 * Uses Intl.NumberFormat with notation "engineering". Similar to scientific
 * notation but exponents are always multiples of 3 (e.g., 12.3E3 for 12300).
 * Common in engineering contexts where SI prefixes (kilo, mega, etc.) apply.
 *
 * @example
 * ```ts
 * // Engineering notation (12.3E3, 456E-6)
 * Chart.Axis({ tickFormat: TickFormat.Engineering() })
 * // Or using string literal:
 * Chart.Axis({ tickFormat: "engineering" })
 * ```
 */
export function EngineeringTickFormat(): ExprType<TickFormatType> {
    return East.value(variant("engineering", null), TickFormatType);
}

/**
 * Creates a date tick format for axis values.
 *
 * @param format - Optional configuration for date formatting
 * @param format.style - Date style: "full" (Wednesday, March 15, 2024), "long" (March 15, 2024),
 *   "medium" (Mar 15, 2024), or "short" (3/15/24)
 * @returns An East expression representing the date tick format
 *
 * @remarks
 * Uses Intl.DateTimeFormat. When called without arguments, uses the browser's
 * default date format. The actual output format depends on the user's locale.
 *
 * @example
 * ```ts
 * // Default date format
 * Chart.Axis({ tickFormat: TickFormat.Date() })
 *
 * // Short date (3/15/24)
 * Chart.Axis({ tickFormat: TickFormat.Date({ style: "short" }) })
 *
 * // Long date (March 15, 2024)
 * Chart.Axis({ tickFormat: TickFormat.Date({ style: "long" }) })
 * ```
 */
export function DateTickFormat(format?: DateFormat): ExprType<TickFormatType> {
    return East.value(variant("date", {
        style: format?.style !== undefined
            ? some(typeof format.style === "string" ? variant(format.style, null) : format.style)
            : none,
    }), TickFormatType);
}

/**
 * Creates a time tick format for axis values.
 *
 * @param format - Optional configuration for time formatting
 * @param format.style - Time style: "full" (3:30:45 PM Eastern Standard Time),
 *   "long" (3:30:45 PM EST), "medium" (3:30:45 PM), or "short" (3:30 PM)
 * @param format.hour12 - Use 12-hour format (true) or 24-hour format (false)
 * @returns An East expression representing the time tick format
 *
 * @remarks
 * Uses Intl.DateTimeFormat. When called without arguments, uses the browser's
 * default time format. The hour12 option overrides the locale's default.
 *
 * @example
 * ```ts
 * // Default time format
 * Chart.Axis({ tickFormat: TickFormat.Time() })
 *
 * // Short time in 24-hour format (15:30)
 * Chart.Axis({ tickFormat: TickFormat.Time({ style: "short", hour12: false }) })
 *
 * // Medium time in 12-hour format (3:30:45 PM)
 * Chart.Axis({ tickFormat: TickFormat.Time({ style: "medium", hour12: true }) })
 * ```
 */
export function TimeTickFormat(format?: TimeFormat): ExprType<TickFormatType> {
    return East.value(variant("time", {
        style: format?.style !== undefined
            ? some(typeof format.style === "string" ? variant(format.style, null) : format.style)
            : none,
        hour12: format?.hour12 !== undefined ? some(format.hour12) : none,
    }), TickFormatType);
}

/**
 * Creates a combined date and time tick format for axis values.
 *
 * @param format - Optional configuration for datetime formatting
 * @param format.dateStyle - Date style: "full", "long", "medium", or "short"
 * @param format.timeStyle - Time style: "full", "long", "medium", or "short"
 * @param format.hour12 - Use 12-hour format (true) or 24-hour format (false)
 * @returns An East expression representing the datetime tick format
 *
 * @remarks
 * Uses Intl.DateTimeFormat with both dateStyle and timeStyle. Combines date
 * and time into a single formatted string. When called without arguments,
 * uses the browser's default datetime format.
 *
 * @example
 * ```ts
 * // Default datetime format
 * Chart.Axis({ tickFormat: TickFormat.DateTime() })
 *
 * // Short date and time (3/15/24, 3:30 PM)
 * Chart.Axis({ tickFormat: TickFormat.DateTime({ dateStyle: "short", timeStyle: "short" }) })
 *
 * // Medium date, short time in 24-hour format
 * Chart.Axis({ tickFormat: TickFormat.DateTime({
 *   dateStyle: "medium",
 *   timeStyle: "short",
 *   hour12: false
 * }) })
 * ```
 */
export function DateTimeTickFormat(format?: DateTimeFormat): ExprType<TickFormatType> {
    return East.value(variant("datetime", {
        dateStyle: format?.dateStyle !== undefined
            ? some(typeof format.dateStyle === "string" ? variant(format.dateStyle, null) : format.dateStyle)
            : none,
        timeStyle: format?.timeStyle !== undefined
            ? some(typeof format.timeStyle === "string" ? variant(format.timeStyle, null) : format.timeStyle)
            : none,
        hour12: format?.hour12 !== undefined ? some(format.hour12) : none,
    }), TickFormatType);
}

/**
 * Simple tick format literals for formats that don't require configuration.
 *
 * @remarks
 * Use these for quick formatting without options. For formats requiring
 * configuration (currency, unit, date/time with options), use TickFormat helpers.
 */
export type SimpleTickFormatLiteral = "number" | "percent" | "compact" | "scientific" | "engineering" | "date" | "time" | "datetime";

/**
 * Converts a simple tick format literal string to a TickFormatType expression.
 *
 * @param format - A simple format literal: "number", "percent", "compact",
 *   "scientific", "engineering", "date", "time", or "datetime"
 * @returns An East expression representing the tick format with default options
 *
 * @remarks
 * This is used internally to convert string literals to tick format expressions.
 * For formats requiring configuration (currency, unit), use the specific helper
 * functions like {@link CurrencyTickFormat} or {@link UnitTickFormat}.
 *
 * @example
 * ```ts
 * // These are equivalent:
 * Chart.Axis({ tickFormat: "compact" })
 * Chart.Axis({ tickFormat: simpleTickFormatToExpr("compact") })
 * Chart.Axis({ tickFormat: TickFormat.Compact() })
 * ```
 */
export function simpleTickFormatToExpr(format: SimpleTickFormatLiteral): ExprType<TickFormatType> {
    switch (format) {
        case "number":
            return NumberTickFormat();
        case "percent":
            return PercentTickFormat();
        case "compact":
            return CompactTickFormat();
        case "scientific":
            return ScientificTickFormat();
        case "engineering":
            return EngineeringTickFormat();
        case "date":
            return DateTickFormat();
        case "time":
            return TimeTickFormat();
        case "datetime":
            return DateTimeTickFormat();
    }
}

/**
 * Namespace for tick format helper functions.
 *
 * @example
 * ```ts
 * // Simple formats (can also use string literals "number", "percent", etc.)
 * TickFormat.Number()
 * TickFormat.Percent()
 * TickFormat.Compact({ display: "short" })
 *
 * // Currency with options
 * TickFormat.Currency({ currency: "USD", display: "symbol" })
 * TickFormat.Currency({ currency: "EUR", display: "code" })
 *
 * // Units
 * TickFormat.Unit({ unit: "gigabyte", display: "short" })
 * TickFormat.Unit({ unit: "kilometer", display: "long" })
 *
 * // Date/Time
 * TickFormat.Date({ style: "short" })
 * TickFormat.Time({ style: "medium", hour12: true })
 * TickFormat.DateTime({ dateStyle: "short", timeStyle: "short" })
 * ```
 */
export const TickFormat = {
    Number: NumberTickFormat,
    Currency: CurrencyTickFormat,
    Percent: PercentTickFormat,
    Compact: CompactTickFormat,
    Unit: UnitTickFormat,
    Scientific: ScientificTickFormat,
    Engineering: EngineeringTickFormat,
    Date: DateTickFormat,
    Time: TimeTickFormat,
    DateTime: DateTimeTickFormat,
} as const;

// ============================================================================
// Curve Type
// ============================================================================

/**
 * Line/Area curve type.
 *
 * @remarks
 * Maps to Recharts curve types for controlling line smoothness.
 *
 * @property linear - Straight lines between points
 * @property natural - Natural cubic spline
 * @property monotone - Monotone cubic spline
 * @property step - Step function
 * @property stepBefore - Step function before point
 * @property stepAfter - Step function after point
 */
export const CurveType = VariantType({
    linear: NullType,
    natural: NullType,
    monotone: NullType,
    step: NullType,
    stepBefore: NullType,
    stepAfter: NullType,
});

/**
 * Type representing curve type.
 */
export type CurveType = typeof CurveType;

/**
 * String literal type for curve values.
 */
export type CurveLiteral = "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter";

export function Curve(curve: CurveLiteral): ExprType<CurveType> {
    return East.value(variant(curve, null), CurveType);
}

// ============================================================================
// Stack Offset Type
// ============================================================================

/**
 * Stack offset mode for stacked charts.
 *
 * @remarks
 * Controls how stacked areas/bars are positioned.
 *
 * @property none - Regular stacking (default)
 * @property expand - Normalize to 100%
 * @property wiggle - Streamgraph style
 * @property silhouette - Centered streamgraph
 */
export const StackOffsetType = VariantType({
    none: NullType,
    expand: NullType,
    wiggle: NullType,
    silhouette: NullType,
});

/**
 * Type representing stack offset.
 */
export type StackOffsetType = typeof StackOffsetType;

/**
 * String literal type for stack offset values.
 */
export type StackOffsetLiteral = "none" | "expand" | "wiggle" | "silhouette";


export function StackOffset(offset: StackOffsetLiteral): ExprType<StackOffsetType> {
    return East.value(variant(offset, null), StackOffsetType);
}

// ============================================================================
// Bar Layout Type
// ============================================================================

/**
 * Bar chart layout direction.
 *
 * @remarks
 * Note: In Recharts, "horizontal" layout = vertical bars,
 * "vertical" layout = horizontal bars.
 *
 * @property horizontal - Vertical bars (default)
 * @property vertical - Horizontal bars
 */
export const BarLayoutType = VariantType({
    horizontal: NullType,
    vertical: NullType,
});

/**
 * Type representing bar layout.
 */
export type BarLayoutType = typeof BarLayoutType;

/**
 * String literal type for bar layout values.
 */
export type BarLayoutLiteral = "horizontal" | "vertical";

export function BarLayout(layout: BarLayoutLiteral): ExprType<BarLayoutType> {
    return East.value(variant(layout, null), BarLayoutType);
}

// ============================================================================
// Chart Grid Type
// ============================================================================

/**
 * Grid configuration for chart background lines.
 *
 * @remarks
 * Maps to Recharts CartesianGrid component properties.
 *
 * @property show - Enable/disable entire grid (defaults to true if grid is specified)
 * @property vertical - Show vertical grid lines
 * @property horizontal - Show horizontal grid lines
 * @property strokeColor - Grid line color (Chakra color token)
 * @property strokeDasharray - Dash pattern (e.g., "3 3" for dashed lines)
 */
export const ChartGridType = StructType({
    show: OptionType(BooleanType),
    vertical: OptionType(BooleanType),
    horizontal: OptionType(BooleanType),
    strokeColor: OptionType(StringType),
    strokeDasharray: OptionType(StringType),
});

/**
 * Type representing chart grid configuration.
 */
export type ChartGridType = typeof ChartGridType;

/**
 * TypeScript interface for chart grid configuration.
 */
export interface ChartGrid {
    /** Enable/disable entire grid */
    show?: SubtypeExprOrValue<BooleanType>;
    /** Show vertical grid lines */
    vertical?: SubtypeExprOrValue<BooleanType>;
    /** Show horizontal grid lines */
    horizontal?: SubtypeExprOrValue<BooleanType>;
    /** Grid line color (Chakra color token, e.g., "border.muted") */
    strokeColor?: SubtypeExprOrValue<StringType>;
    /** Dash pattern (e.g., "3 3" for dashed lines) */
    strokeDasharray?: SubtypeExprOrValue<StringType>;
}

export function ChartGrid(grid: ChartGrid): ExprType<ChartGridType> {
    return East.value({
        show: grid.show ? some(grid.show) : none,
        vertical: grid.vertical ? some(grid.vertical) : none,
        horizontal: grid.horizontal ? some(grid.horizontal) : none,
        strokeColor: grid.strokeColor ? some(grid.strokeColor) : none,
        strokeDasharray: grid.strokeDasharray ? some(grid.strokeDasharray) : none,
    }, ChartGridType);
}   

// ============================================================================
// Chart Legend Type
// ============================================================================

/**
 * Legend layout direction.
 *
 * @property horizontal - Items arranged horizontally
 * @property vertical - Items arranged vertically
 */
export const LegendLayoutType = VariantType({
    horizontal: NullType,
    vertical: NullType,
});

/**
 * Type representing legend layout.
 */
export type LegendLayoutType = typeof LegendLayoutType;

/**
 * String literal type for legend layout values.
 */
export type LegendLayoutLiteral = "horizontal" | "vertical";

export function LegendLayout(layout: LegendLayoutLiteral): ExprType<LegendLayoutType> {
    return East.value(variant(layout, null), LegendLayoutType);
}

/**
 * Legend horizontal alignment.
 *
 * @property left - Align to left
 * @property center - Center alignment
 * @property right - Align to right
 */
export const LegendAlignType = VariantType({
    left: NullType,
    center: NullType,
    right: NullType,
});

/**
 * Type representing legend alignment.
 */
export type LegendAlignType = typeof LegendAlignType;

/**
 * String literal type for legend align values.
 */
export type LegendAlignLiteral = "left" | "center" | "right";

export function LegendAlign(align: LegendAlignLiteral): ExprType<LegendAlignType> {
    return East.value(variant(align, null), LegendAlignType);
}

/**
 * Legend vertical alignment.
 *
 * @property top - Align to top
 * @property middle - Center vertically
 * @property bottom - Align to bottom
 */
export const LegendVerticalAlignType = VariantType({
    top: NullType,
    middle: NullType,
    bottom: NullType,
});

/**
 * Type representing legend vertical alignment.
 */
export type LegendVerticalAlignType = typeof LegendVerticalAlignType;

/**
 * String literal type for legend vertical align values.
 */
export type LegendVerticalAlignLiteral = "top" | "middle" | "bottom";

export function LegendVerticalAlign(verticalAlign: LegendVerticalAlignLiteral): ExprType<LegendVerticalAlignType> {
    return East.value(variant(verticalAlign, null), LegendVerticalAlignType);
}

/**
 * Legend configuration for charts.
 *
 * @remarks
 * Maps to Recharts Legend component properties.
 *
 * @property show - Enable/disable legend
 * @property layout - Horizontal or vertical arrangement
 * @property align - Horizontal alignment (left, center, right)
 * @property verticalAlign - Vertical alignment (top, middle, bottom)
 */
export const ChartLegendType = StructType({
    show: OptionType(BooleanType),
    layout: OptionType(LegendLayoutType),
    align: OptionType(LegendAlignType),
    verticalAlign: OptionType(LegendVerticalAlignType),
});

/**
 * Type representing chart legend configuration.
 */
export type ChartLegendType = typeof ChartLegendType;

/**
 * TypeScript interface for chart legend configuration.
 */
export interface ChartLegend {
    /** Enable/disable legend */
    show?: SubtypeExprOrValue<BooleanType>;
    /** Horizontal or vertical arrangement */
    layout?: SubtypeExprOrValue<LegendLayoutType> | LegendLayoutLiteral;
    /** Horizontal alignment */
    align?: SubtypeExprOrValue<LegendAlignType> | LegendAlignLiteral;
    /** Vertical alignment */
    verticalAlign?: SubtypeExprOrValue<LegendVerticalAlignType> | LegendVerticalAlignLiteral;
}

export function ChartLegend(legend: ChartLegend): ExprType<ChartLegendType> {
    return East.value({
        show: legend.show ? some(legend.show) : none,
        layout: legend.layout
            ? some(typeof legend.layout === "string" ? variant(legend.layout, null) : legend.layout)
            : none,
        align: legend.align
            ? some(typeof legend.align === "string" ? variant(legend.align, null) : legend.align)
            : none,
        verticalAlign: legend.verticalAlign
            ? some(typeof legend.verticalAlign === "string" ? variant(legend.verticalAlign, null) : legend.verticalAlign)
            : none,
    }, ChartLegendType);
}

// ============================================================================
// Chart Tooltip Type
// ============================================================================

/**
 * Tooltip cursor style variant.
 *
 * @property none - No cursor shown
 * @property crosshair - Dashed crosshair lines
 * @property fill - Filled area cursor
 */
export const TooltipCursorType = VariantType({
    none: NullType,
    crosshair: StringType,
    fill: StringType
});

export type TooltipCursorType = typeof TooltipCursorType;



/**
 * Tooltip configuration for charts.
 *
 * @remarks
 * Maps to Recharts Tooltip component properties.
 *
 * @property show - Enable/disable tooltip
 * @property cursor - Cursor style (none, crosshair, or fill)
 * @property animationDuration - Animation duration in milliseconds
 */
export const ChartTooltipType = StructType({
    show: OptionType(BooleanType),
    cursor: OptionType(TooltipCursorType),
    animationDuration: OptionType(IntegerType),
});

/**
 * Type representing chart tooltip configuration.
 */
export type ChartTooltipType = typeof ChartTooltipType;

/**
 * TypeScript interface for chart tooltip configuration.
 */
export interface ChartTooltip {
    /** Enable/disable tooltip */
    show?: SubtypeExprOrValue<BooleanType>;
    /** Cursor style configuration */
    cursor?: SubtypeExprOrValue<TooltipCursorType>;
    /** Animation duration in milliseconds */
    animationDuration?: SubtypeExprOrValue<IntegerType>;
}

export function ChartTooltip(tooltip: ChartTooltip): ExprType<ChartTooltipType> {
    return East.value({
        show: tooltip.show ? some(tooltip.show) : none,
        cursor: tooltip.cursor
            ? some(typeof tooltip.cursor === "string" ? variant(tooltip.cursor, null) : tooltip.cursor)
            : none,
        animationDuration: tooltip.animationDuration ? some(tooltip.animationDuration) : none,
    }, ChartTooltipType);
}

// ============================================================================
// Axis Orientation Type
// ============================================================================

/**
 * Axis orientation/position.
 *
 * @property top - Position at top (for X axis)
 * @property bottom - Position at bottom (for X axis)
 * @property left - Position at left (for Y axis)
 * @property right - Position at right (for Y axis)
 */
export const AxisOrientationType = VariantType({
    top: NullType,
    bottom: NullType,
    left: NullType,
    right: NullType,
});

/**
 * Type representing axis orientation.
 */
export type AxisOrientationType = typeof AxisOrientationType;

/**
 * String literal type for axis orientation values.
 */
export type AxisOrientationLiteral = "top" | "bottom" | "left" | "right";

// ============================================================================
// Chart Axis Type
// ============================================================================

/**
 * Axis configuration type.
 *
 * @remarks
 * Configuration for X or Y axis including data binding, labels, formatting,
 * and visual styling.
 *
 * @property dataKey - Data key for axis values
 * @property label - Axis label text
 * @property tickFormat - Format for tick values
 * @property domain - Value range [min, max]
 * @property hide - Hide the axis entirely
 * @property axisLine - Show/hide axis line
 * @property tickLine - Show/hide tick lines
 * @property tickMargin - Margin between tick and label
 * @property strokeColor - Axis color (Chakra color token)
 * @property orientation - Axis position (top/bottom for X, left/right for Y)
 * @property axisId - Identifier for biaxial charts (e.g., "left", "right")
 */
export const ChartAxisType = StructType({
    dataKey: OptionType(StringType),
    label: OptionType(StringType),
    tickFormat: OptionType(TickFormatType),
    domain: OptionType(ArrayType(FloatType)),
    hide: OptionType(BooleanType),
    axisLine: OptionType(BooleanType),
    tickLine: OptionType(BooleanType),
    tickMargin: OptionType(IntegerType),
    strokeColor: OptionType(StringType),
    orientation: OptionType(AxisOrientationType),
    axisId: OptionType(StringType),
});

/**
 * Type representing chart axis configuration.
 */
export type ChartAxisType = typeof ChartAxisType;

/**
 * TypeScript interface for chart axis configuration.
 */
export interface ChartAxis {
    /** Data key for axis values */
    dataKey?: SubtypeExprOrValue<StringType>;
    /** Axis label text */
    label?: SubtypeExprOrValue<StringType>;
    /** Format for tick values - use string literals or TickFormat helpers */
    tickFormat?: SubtypeExprOrValue<TickFormatType> | SimpleTickFormatLiteral;
    /** Value range [min, max] */
    domain?: SubtypeExprOrValue<ArrayType<FloatType>>;
    /** Hide the axis entirely */
    hide?: SubtypeExprOrValue<BooleanType>;
    /** Show/hide axis line */
    axisLine?: SubtypeExprOrValue<BooleanType>;
    /** Show/hide tick lines */
    tickLine?: SubtypeExprOrValue<BooleanType>;
    /** Margin between tick and label */
    tickMargin?: SubtypeExprOrValue<IntegerType>;
    /** Axis color (Chakra color token) */
    strokeColor?: SubtypeExprOrValue<StringType>;
    /** Axis position (top/bottom for X, left/right for Y) */
    orientation?: SubtypeExprOrValue<AxisOrientationType> | AxisOrientationLiteral;
    /** Identifier for biaxial charts (e.g., "left", "right") */
    axisId?: SubtypeExprOrValue<StringType>;
}

export function ChartAxis(axis: ChartAxis): ExprType<typeof ChartAxisType> {
    return East.value({
        dataKey: axis.dataKey !== undefined ? some(axis.dataKey) : none,
        label: axis.label !== undefined ? some(axis.label) : none,
        tickFormat: axis.tickFormat
            ? (typeof axis.tickFormat === "string"
                ? some(simpleTickFormatToExpr(axis.tickFormat))
                : some(axis.tickFormat))
            : none,
        domain: axis.domain !== undefined ? some(axis.domain) : none,
        hide: axis.hide !== undefined ? some(axis.hide) : none,
        axisLine: axis.axisLine !== undefined ? some(axis.axisLine) : none,
        tickLine: axis.tickLine !== undefined ? some(axis.tickLine) : none,
        tickMargin: axis.tickMargin !== undefined ? some(axis.tickMargin) : none,
        strokeColor: axis.strokeColor !== undefined ? some(axis.strokeColor) : none,
        orientation: axis.orientation
            ? some(typeof axis.orientation === "string" ? variant(axis.orientation, null) : axis.orientation)
            : none,
        axisId: axis.axisId !== undefined ? some(axis.axisId) : none,
    }, ChartAxisType);
}

// ============================================================================
// Common Chart Style Properties
// ============================================================================

/**
 * Base chart dimensions and display options.
 */
/**
 * Chart margin configuration.
 *
 * @property top - Top margin in pixels
 * @property right - Right margin in pixels
 * @property bottom - Bottom margin in pixels
 * @property left - Left margin in pixels
 */
export const ChartMarginType = StructType({
    top: OptionType(IntegerType),
    right: OptionType(IntegerType),
    bottom: OptionType(IntegerType),
    left: OptionType(IntegerType),
});
export type ChartMarginType = typeof ChartMarginType;

/**
 * TypeScript interface for chart margin configuration.
 */
export interface ChartMargin {
    /** Top margin in pixels */
    top?: SubtypeExprOrValue<IntegerType>;
    /** Right margin in pixels */
    right?: SubtypeExprOrValue<IntegerType>;
    /** Bottom margin in pixels */
    bottom?: SubtypeExprOrValue<IntegerType>;
    /** Left margin in pixels */
    left?: SubtypeExprOrValue<IntegerType>;
}

/**
 * Creates a chart margin configuration.
 */
export function ChartMargin(margin: ChartMargin): ExprType<ChartMarginType> {
    return East.value({
        top: margin.top !== undefined ? some(margin.top) : none,
        right: margin.right !== undefined ? some(margin.right) : none,
        bottom: margin.bottom !== undefined ? some(margin.bottom) : none,
        left: margin.left !== undefined ? some(margin.left) : none,
    }, ChartMarginType);
}

export interface BaseChartStyle {
    /** Grid configuration */
    grid?: SubtypeExprOrValue<ChartGridType>;
    /** Tooltip configuration */
    tooltip?: SubtypeExprOrValue<ChartTooltipType>;
    /** Legend configuration */
    legend?: SubtypeExprOrValue<ChartLegendType>;
    /** Chart margin configuration */
    margin?: SubtypeExprOrValue<ChartMarginType>;
}

/**
 * Base chart style type for serialization.
 */
export const BaseChartStyleType = StructType({
    grid: OptionType(ChartGridType),
    tooltip: OptionType(ChartTooltipType),
    legend: OptionType(ChartLegendType),
    margin: OptionType(ChartMarginType),
});
