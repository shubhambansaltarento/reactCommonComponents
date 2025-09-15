import { Box, Typography } from '@mui/material';
import './Stepper.css';

type Step = {
  label: string;
  status: string;
  icon?: React.ReactNode;
};

type ColorConfig = {
  completed?: string;
  active?: string;
  pending?: string;
};

type ClassNames = {
  container?: string;
  stepperMain?: string;
  stepItem?: string;
  stepItemLimited?: string;
  connectorLine?: string;
  stepCircle?: string;
  stepCircleInner?: string;
  stepLabel?: string;
  mobileStatus?: string;
  mobileStatusLabel?: string;
  mobileStatusSpan?: string;
};

type StepperProps = {
  activeStep: number;
  steps: Step[];
  colors?: ColorConfig;
  classNames?: ClassNames;
  showMobileView?: boolean;
  showStepNumbers?: boolean;
  stepNumberFormat?: (index: number) => string;
  showIcons?: boolean;
  iconPosition?: "top" | "left" | "right" | "replace-number";
  onStepClick?: (stepNumber: number) => void;
};

const getStatusToStepIndex = (steps: Step[]) => {
  const map: Record<string, number> = {};
  steps.forEach((step, idx) => {
    map[step.status] = idx;
  });
  return map;
};

const getStatus = (
  stepIndex: number,
  activeStep: number
): "completed" | "active" | "pending" =>
  stepIndex < activeStep
    ? "completed"
    : stepIndex === activeStep
    ? "active"
    : "pending";

const getColor = (
  status: "completed" | "active" | "pending",
  customColors?: ColorConfig
): string => {
  const defaultColorMap: Record<typeof status, string> = {
    completed: "var(--success-400)",
    active: "var(--info-500)",
    pending: "var(--primary-700)",
  };

  if (customColors) {
    return customColors[status] || defaultColorMap[status];
  }

  return defaultColorMap[status];
};

function StepItem({
  index,
  label,
  status,
  isLast,
  steps,
  colors,
  classNames,
  showStepNumbers = true,
  stepNumberFormat,
  icon,
  showIcons = false,
  iconPosition = "top",
  onStepClick,
}: {
  index: number;
  label: string;
  status: "completed" | "active" | "pending";
  isLast: boolean;
  steps: Step[];
  colors?: ColorConfig;
  classNames?: ClassNames;
  showStepNumbers?: boolean;
  stepNumberFormat?: (index: number) => string;
  icon?: React.ReactNode;
  showIcons?: boolean;
  iconPosition?: "top" | "left" | "right" | "replace-number";
  onStepClick?: (stepNumber: number) => void;
}) {
  const color = getColor(status, colors);
  const stepNumber = stepNumberFormat
    ? stepNumberFormat(index)
    : (index + 1).toString().padStart(2, "0");
  const baseStepClass = steps.length <= 6 ? "step limited" : "step";
  const stepClass = classNames?.stepItem
    ? `${baseStepClass} ${classNames.stepItem}`
    : baseStepClass;
  const limitedStepClass = classNames?.stepItemLimited
    ? classNames.stepItemLimited
    : "";
  const shouldShowIcon = showIcons && icon;
  const shouldShowNumber = showStepNumbers && iconPosition !== "replace-number";

  return (
    <Box
      key={index}
      flex={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      className={`${stepClass} ${steps.length <= 6 ? limitedStepClass : ""}`}
    >
      {/* Connector Line */}
      {!isLast && (
        <Box
          className={
            classNames?.connectorLine
              ? `connector-line ${classNames.connectorLine}`
              : "connector-line"
          }
          sx={{
            backgroundColor:
              status === "completed"
                ? colors?.completed || "var(--success-400)"
                : colors?.pending || "var(--primary-600)",
          }}
        />
      )}

      {/* Icon at top position */}
      {shouldShowIcon && iconPosition === "top" && (
        <Box
          sx={{
            mb: 1,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      )}

      {/* Step Circle + Number/Icon */}
      <Box
        display="flex"
        alignItems="center"
        className={
          classNames?.stepCircle
            ? `step-circle ${classNames.stepCircle}`
            : "step-circle"
        }
        onClick={() => onStepClick?.(index)}
        sx={{ cursor: onStepClick ? "pointer" : "default" }}
      >
        {/* Icon at left position */}
        {shouldShowIcon && iconPosition === "left" && (
          <Box
            sx={{ mr: 1, color: color, display: "flex", alignItems: "center" }}
          >
            {icon}
          </Box>
        )}

        <Box
          className={
            classNames?.stepCircleInner
              ? `step-circle-inner ${classNames.stepCircleInner}`
              : "step-circle-inner"
          }
          sx={{ backgroundColor: color }}
        />

        {/* Show icon instead of number */}
        {shouldShowIcon && iconPosition === "replace-number" ? (
          <Box
            sx={{
              color:
                status === "active"
                  ? colors?.active || "var(--info-500)"
                  : status === "completed"
                  ? "var(--color-black)"
                  : "var(--primary-1000)",
            }}
          >
            {icon}
          </Box>
        ) : (
          shouldShowNumber && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: 13,
                color:
                  status === "active"
                    ? colors?.active || "var(--info-500)"
                    : status === "completed"
                    ? "var(--color-black)"
                    : "var(--primary-1000)",
              }}
            >
              {stepNumber}
            </Typography>
          )
        )}

        {/* Icon at right position */}
        {shouldShowIcon && iconPosition === "right" && (
          <Box
            sx={{ ml: 1, color: color, display: "flex", alignItems: "center" }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* Label */}
      <Typography
        variant="body2"
        className={classNames?.stepLabel}
        sx={{
          mt: 1,
          fontWeight: status === "active" ? 700 : 400,
          color:
            status === "active" ? colors?.active || "var(--info-500)" : "var(--color-black)",
          fontSize: 13,
          px: "5px",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function Stepper({
  activeStep,
  steps,
  colors,
  classNames,
  showMobileView = true,
  showStepNumbers = true,
  stepNumberFormat,
  showIcons = false,
  iconPosition = "top",
  onStepClick,
}: StepperProps) {
  return (
    <>
      <Box
        className={
          classNames?.stepperMain
            ? `stepper-main ${classNames.stepperMain}`
            : "stepper-main"
        }
        width="100%"
        position="relative"
      >
        {steps.map((step, index) => {
          const status = getStatus(index, activeStep);
          return (
            <StepItem
              key={index}
              index={index}
              label={step.label}
              status={status}
              isLast={index === steps.length - 1}
              steps={steps}
              colors={colors}
              classNames={classNames}
              showStepNumbers={showStepNumbers}
              stepNumberFormat={stepNumberFormat}
              icon={step.icon}
              showIcons={showIcons}
              iconPosition={iconPosition}
              onStepClick={onStepClick}
            />
          );
        })}
      </Box>

      {/* Mobile view */}
      {showMobileView && (
        <Box
          className={
            classNames?.mobileStatus
              ? `mobile-status ${classNames.mobileStatus}`
              : "mobile-status"
          }
          textAlign="center"
        >
          <Typography
            component="label"
            fontWeight={600}
            className={classNames?.mobileStatusLabel}
            sx={{
              color: colors?.active || "var(--info-500)",
            }}
          >
            {steps[activeStep]?.label}
          </Typography>
          <Typography component="span" className={classNames?.mobileStatusSpan}>
            Step {activeStep + 1}/{steps.length}
          </Typography>
        </Box>
      )}
    </>
  );
}

// Utility to get activeStep from status
export function getActiveStep(status: string, steps: Step[]): number {
  const statusToStepIndex = getStatusToStepIndex(steps);
  return statusToStepIndex[status] ?? 0;
}
