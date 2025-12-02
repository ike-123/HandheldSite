import React, { useEffect, useState } from 'react'
import { useMainStore } from '../Stores/MainStore';
import ImageUrl from './Components/ImageUrl';

const ComparisonPage = () => {


    const [Handhelds, SetHandhelds] = useState([]);
    const GetHandhelds = useMainStore((state) => state.GetAllHandhelds);

    const [Handheld1, SetHandheld1] = useState<any>();
    const [Handheld2, SetHandheld2] = useState<any>();
    const [Handheld3, SetHandheld3] = useState<any>();



    useEffect(() => {

        async function Get_All_Handhelds() {

            const { data } = await GetHandhelds();

            SetHandheld1(data[0])
            SetHandheld2(data[1])
            SetHandheld3(data[3])

            console.log(data);
            SetHandhelds(data);
        }

        Get_All_Handhelds();

    }, [])


    function setHandheld1change(event: any) {

        const id = Number(event.target.value);

        const selected = Handhelds.find((h: any) => h.handheldId === id);

        SetHandheld1(selected)

        console.log(event.target.value);

    }

    function setHandheld2change(event: any) {
        const id = Number(event.target.value);
        const selected = Handhelds.find((h: any) => h.handheldId === id);
        SetHandheld2(selected)

    }
    function setHandheld3change(event: any) {
        const id = Number(event.target.value);
        const selected = Handhelds.find((h: any) => h.handheldId === id);
        SetHandheld3(selected)

    }




    return (
        <>


            <div className='flex max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* <div className='w-full bg-amber-200 h-15'></div> */}

                <div className='flex  relative flex-col items-center pt-5 w-75 min-w-60 bg-primary outline-1'>

                    {/* <h1 className='font-bold text-2xl truncate'>Specifications</h1> */}

                    <div className='h-53 text-3xl p-25'>Specifications</div>
                    {/* <img className=' w-full  h-45 object-cover mx-auto invisible' src="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" alt="" /> */}


                    <div className="divider w-3/4 mx-auto"></div>


                    <h1 className='text-xl font-bold'>Release date</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>Processor</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>CPU</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>GPU</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>RAM</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>Display</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-xl font-bold'>Battery</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>



                </div>


                <div className='flex flex-col items-center pt-5 w-75 min-w-60 bg-primary outline-1'>

                    <select className="select mb" value={Handheld1?.handheldId} onChange={setHandheld1change}>

                        {
                            Handhelds.map((handheld: any) => (

                                <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                            ))
                        }

                    </select>

                    {/* <img className=' w-full h-45 object-cover mx-auto' src={Handheld1?.handheldImg} alt="" /> */}
                    <ImageUrl TailwindStyles='w-full h-45 object-cover mx-auto' image={Handheld1?.handheldImg}/>



                    <div className="divider w-3/4 mx-auto"></div>


                    <h1 className='text-lg'>{Handheld1?.handheldName}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.processor}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.cpu} </h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.gpu}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.ram}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.display}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld1?.battery}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>



                </div>


                <div className='flex flex-col items-center pt-5  w-75 min-w-60 bg-primary outline-1'>

                    <select className="select mb" value={Handheld2?.handheldId} onChange={setHandheld2change}>

                        {
                            Handhelds.map((handheld: any) => (

                                <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                            ))
                        }

                    </select>

                    {/* <img className=' w-full h-45 object-cover mx-auto' src={Handheld2?.handheldImg} alt="" /> */}
                    <ImageUrl TailwindStyles='w-full h-45 object-cover mx-auto' image={Handheld2?.handheldImg}/>


                    <div className="divider w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.handheldName}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.processor}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.cpu} </h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.gpu}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.ram}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.display}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld2?.battery}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>


                </div>

                <div className='flex flex-col items-center pt-5 w-75 min-w-60 bg-primary outline-1'>

                    <select className="select mb" value={Handheld3?.handheldId} onChange={setHandheld3change}>

                        {
                            Handhelds.map((handheld: any) => (

                                <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                            ))
                        }

                    </select>
                    
                    <ImageUrl TailwindStyles='w-full h-45 object-cover mx-auto' image={Handheld3?.handheldImg}/>

                    <div className="divider w-3/4 mx-auto"></div>


                    <h1 className='text-lg'>{Handheld3?.handheldName}</h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.processor}</h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.cpu} </h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.gpu}</h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.ram}</h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.display}</h1>
                    <div className="divider my-3 w-3/3 mx-auto"></div>

                    <h1 className='text-lg'>{Handheld3?.battery}</h1>
                    <div className="divider my-3 w-3/4 mx-auto"></div>




                </div>




            </div>
        </>
    )
}

export default ComparisonPage