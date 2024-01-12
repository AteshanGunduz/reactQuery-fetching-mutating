import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid'
import './App.css';
import { useState } from 'react';

type Post = {
  id: string;
  title: string;
};

const POST:Post[] = [
  {id:"1", title: "Recruit 1"},
  {id:"2", title: "Recruit 2"}
]
function wait(duration: number | undefined){
  return new Promise<void>(resolve => setTimeout(resolve, duration))
}


function App() {
   const [number, setNumber] = useState(3)
   const queryClient = useQueryClient()

   const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: (obj)=> wait(100).then(()=> {console.log(obj); return [...POST]})
   })

   const newPostMutation = useMutation({
      mutationFn: async (title:string) => {
        await wait(100);
       return POST.push({ id: uuidv4(), title });
      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ['posts']})
      }
   })

   if(postsQuery.isLoading) return <h1 className='bg-blue-300 font-semibold text-xl'>Loading...</h1>
   if(postsQuery.isError) return <h1>An Error Occurred</h1>

   const handleAdd = ()=>{
    setNumber((pre)=>pre+1)
    const addTitle = `Recruit ${number}`
    newPostMutation.mutate(addTitle)
   }
    

console.log(POST);

  return (
    <div className="flex flex-col justify-center items-center m-10 p-2 font-semibold">
    {postsQuery.data?.map((post)=>{
      return <div key={post.id} className=''>
         <h2>{post.title}</h2>
        </div>
    })}
    <button onClick={handleAdd} className='bg-blue-400 p-2 rounded-lg text-white'>Add New</button>
    </div>
  );
}

export default App;
