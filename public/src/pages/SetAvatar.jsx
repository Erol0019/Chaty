import { useState, useEffect } from 'react'
import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import loader from '../assets/loader.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes'

export default function SetAvatar() {
    const api = 'https://api.multiavar.com/45678945'
    const navigate = useNavigate();

  return(
    <>
    <Container>
        SetAvatar
    </Container>;
    <ToastContainer />
    </>
  );
}

const Container = styled.div``;
