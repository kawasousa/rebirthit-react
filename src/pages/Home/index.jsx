import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../assets/icons/project-icons'
import { useEffect, useRef, useState } from 'react'
import { usePosts } from '../../hooks/posts/UsePosts'
import RoundContainer from '../../components/RoundContainer'
import LogoContainer from '../../components/LogoContainer'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, loggoutUser } from '../../services/authService'
import { createPost } from '../../services/PostService'
import ErrorPage from '../ErrorPage'


function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            const userData = await getCurrentUser();
            if (!userData) navigate("/login");
            else setUser(userData);
        }
        checkAuth()
        
    }, [navigate]);

    const [user, setUser] = useState(null);

    const newPostContent = useRef("");
    const searchInput = useRef("");
    const { posts, setPosts, loading, error } = usePosts();

    async function createPostHandler(event) {
        event.preventDefault();

        const content = newPostContent.current.innerText;
        if(content){
            const newPost = await createPost(content);
            if(newPost){
                setPosts(prevPosts => [newPost, ...prevPosts]);
            }
            newPostContent.current.innerText = '';
        }
    }

    if(!user){
        return (
            <ErrorPage/>
        )
    }

    return (
        <div className="container">
            <div className="sidebar-container">
                <LogoContainer />

                <RoundContainer extraClasses={"options-container"}>
                    <p>Options</p>
                </RoundContainer>
                <RoundContainer>
                    <button onClick={()=>{loggoutUser(navigate)}}>Sair</button>
                </RoundContainer>
            </div>
            <div className="posts-container">
                <RoundContainer extraClasses={"new-post-container"}>
                    <FontAwesomeIcon icon={user.icon} size='3x' />
                    <p contentEditable name="new-post-input" data-placeholder="O que há de novo?"
                        className='new-post-input' id="new-post-input" ref={newPostContent} />
                    <button onClick={createPostHandler}>Compartilhar</button>
                </RoundContainer>

                <h3>Novas publicações</h3>
                {
                    loading ?
                        <FontAwesomeIcon icon="circle-notch" spin size='3x' />
                        : error ?
                            <RoundContainer extraClasses={"center-container"}>
                                <h2>{error.message}</h2>
                                <FontAwesomeIcon icon="triangle-exclamation" bounce size='4x' />
                                <h3>Não foi possível buscar as publicações</h3>
                            </RoundContainer>
                            : posts.map(post => (
                                <RoundContainer key={post.id}>
                                    <div className="post-profile-container">
                                        <FontAwesomeIcon icon={post.iconOwner} size='2x' />
                                        <p>{post.nameOwner}</p>
                                        <p className="subtle-info">| @{post.usernameOwner}</p>
                                    </div>
                                    <p className="post-content">{post.content}</p>
                                    <p className="subtle-info">{post.createdAt}</p>
                                </RoundContainer>
                            ))
                }
            </div>
            <RoundContainer extraClasses={"search-container"}>
                <input type="text" name="search-input" id="search-input" placeholder='Buscar' ref={searchInput} />
                <button>
                    <FontAwesomeIcon icon="magnifying-glass" />
                </button>
            </RoundContainer>
        </div>
    )
}

export default Home;