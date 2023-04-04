import { Grid, Step, StepConnector, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import { useState } from 'react';
import { withStyles } from '@mui/styles';
import { useTheme } from "@mui/material/styles";
import { Check } from '@mui/icons-material';
import GeneralInformationStepContentComponent from './GeneralInformationStepContent';
import LPFinancialsStepContentComponent from './LPFinancialsStepContent';
import KPIAndIRRStepContentComponent from './KPIAndIRRStepContent';
import CommitmentsStepContentComponent from './CommitmentsStepContent';

const CustomStepConnector = withStyles({
    alternativeLabel: {
        top: 50,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#004A00',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#008000',
        },
    },
    line: {
        borderColor: '#ccc',
        borderTopWidth: 3, // adjust this to make the line thicker
        borderRadius: 1,
        height: '50px',
        marginLeft: '3px'
    },
})(StepConnector);

const CustomStepIcon = (props: any) => {
    const { active, completed, icon, onClick } = props;
    const theme = useTheme();

    return (
        <div >
            {icon && <div style={{ width: '2em', height: '2em', borderRadius: '50%', backgroundColor: active ? '#454545' : completed ? theme.palette.success.main : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }} onClick={onClick} >
                {completed && <Check sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }} />}
            </div>}
        </div>
    );
}

const getSteps = () => {
    return ['General Information', 'Commitments', 'LP Financials', 'KPIs & IRR'];
};

interface EditLPBasicContentProps {
    steps: string[],
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
}

const LPBasicEditContentComponent = ({ steps, activeStep, setActiveStep }: EditLPBasicContentProps) => {
    const theme = useTheme();
    const [activeLabel, setActiveLabel] = useState<string>(steps[0]);

    /**
     * Changes the current active step
     * @param label
     */
    const handleSetActiveStep = (label: string) => {
        if (label) {
            setActiveLabel(label);
            const index = steps?.indexOf(label);
            setActiveStep(index);
        }
    };

    return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'start', flexDirection: 'column' }}>
            <Grid item xs={3} sx={{ marginLeft: '1em' }}>
                <Stepper orientation="vertical" activeStep={activeStep} connector={<CustomStepConnector />}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={CustomStepIcon} onClick={() => handleSetActiveStep(label)} >
                            </StepLabel>
                            <Typography sx={{ fontSize: '14px', textAlign: 'center', width: '80px', marginLeft: '-1.5em', fontWeight: activeLabel === label ? 600 : 400, color: activeStep > index ? theme.palette.success.main : '#454545' }}>{label}</Typography>
                            <StepContent sx={{ mt: 2, ml: 2 }}>
                            </StepContent>

                        </Step>
                    ))}
                </Stepper>
            </Grid>
            <Grid item xs={9}>
                {activeStep === 0 ? <GeneralInformationStepContentComponent />
                    : activeStep === 1
                        ? <CommitmentsStepContentComponent />
                        : activeStep === 2
                            ? <LPFinancialsStepContentComponent />
                            : <KPIAndIRRStepContentComponent />}
            </Grid>
        </Grid>
    );
};

export default LPBasicEditContentComponent;


{/* <Stepper orientation="vertical" activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={CustomStepIcon} onClick={() => handleSetActiveStep(label)}>
                                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    {label}
                                </div>
                            </StepLabel>
                            <StepContent  sx={{ mt: 4, ml: 4 }}>

                            </StepContent>

                        </Step>
                    ))}
                </Stepper> */}