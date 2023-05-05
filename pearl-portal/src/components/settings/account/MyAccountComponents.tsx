import { Avatar, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactComponent as UploadPicIcon } from "../../../assets/icons/UploadPicIcon.svg";
import { ChangeEvent, useRef, useState } from 'react';

const MyAccount = () => {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleUploadClick = () => {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <Grid container direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1}>
            <Grid item sx={{ marginLeft: '1em' }}>
                <Grid container justifyContent="center" >
                    <IconButton size="large" onClick={handleUploadClick}>
                        {selectedImage ? (
                            <Avatar alt='Selected' src={selectedImage} style={{ height: '100px', width: '100px' }} />
                        ) : (
                            <AccountCircleIcon sx={{ fontSize: '100px', color: theme.palette.primary.main }} />
                        )}
                    </IconButton>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </Grid>
            </Grid>
            <Grid item sx={{ marginLeft: '1em' }}>
                <Grid container justifyContent={"center"} alignItems="center" spacing={1}>
                    <Grid item>
                        <Button variant='outlined'
                            onClick={handleUploadClick}
                            sx={{
                                fontFamily: 'Raleway',
                                height: '36px',
                                textTransform: 'none',
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: theme.palette.primary.main
                            }}
                            startIcon={<UploadPicIcon />}>
                            Upload a picture
                        </Button>
                    </Grid>
                    <Grid item>
                        <IconButton disabled={true}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
                <Divider sx={{ marginTop: '1em', width: '100%' }} />
            </Grid>
            <Grid item sx={{ width: '100%', marginLeft: '1em' }}>
                <Grid container>
                    <Typography variant='body2' sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Full Name</Typography>
                </Grid>
                <Grid container>
                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>Jane Doe</Typography>
                </Grid>
            </Grid>
            <Grid item sx={{ width: '100%', marginLeft: '1em' }}>
                <Grid container>
                    <Typography variant='body2' sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Email</Typography>
                </Grid>
                <Grid container>
                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>jane.doe@test.com</Typography>
                </Grid>
            </Grid>
            <Grid item sx={{ width: '100%', marginLeft: '1em' }}>
                <Grid container>
                    <Typography variant='body2' sx={{ color: theme.palette.secondary.main, fontWeight: 400 }}>Phone</Typography>
                </Grid>
                <Grid container>
                    <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{'+411232324'}</Typography>
                </Grid>
            </Grid>
        </Grid>)

};

export default MyAccount;