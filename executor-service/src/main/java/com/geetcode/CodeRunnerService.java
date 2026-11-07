package com.geetcode;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.geetcode.ExecuteController.CaseResult;
import com.geetcode.ExecuteController.ExecRequest;
import com.geetcode.ExecuteController.ExecResponse;

@Service // Tells Spring to manage this worker in the IoC container
public class CodeRunnerService {
    
    public ExecResponse execute(ExecRequest req){
        Path dir=null;

        try{
           // 1. Create a unique isolated temp folder for this submission (e.g. /tmp/job-849201)
            dir=Files.createTempDirectory("job-");
            boolean isCpp="cpp".equalsIgnoreCase(req.language());

            if (isCpp){
                // 2A. Save C++ code to solution.cpp and compile it ONCE with g++
                Files.writeString(dir.resolve("solution.cpp"),req.code());
                Process compile=new ProcessBuilder("g++","solution.cpp","-o","solution")
                                                    .directory(dir.toFile())
                                                    .redirectErrorStream(true)
                                                    .start();

                compile.waitFor(10,TimeUnit.SECONDS);

                if(compile.exitValue()!=0){
                    // Compilation failed! Read the compiler error message and return it
                    String compileErr=new String(compile.getInputStream().readAllBytes());
                    return new ExecResponse(compileErr,List.of());
                }

            }else{
                // 2B. Python doesn't need compiling — just save to solution.py!
                Files.writeString(dir.resolve("solution.py"),req.code());
            }
            // (Next step: we will run the program against all req.inputs() right here!)

            List<CaseResult> results=new ArrayList<>();
            List<String> cmd=isCpp?List.of(dir.resolve("solution").toString()):List.of("python","solution.py");

            for(String ip:req.inputs()){
                // Start the stopwatch INSIDE the loop right before this test case runs!
                long start=System.currentTimeMillis();

                Process run=new ProcessBuilder(cmd).directory(dir.toFile()).start();


                // Feed the test case input into the program's stdin (like typing into cin / input())
                try(var stdin=run.getOutputStream()){
                    stdin.write(ip.getBytes());
                }

                // Wait up to req.timeLimitMs() for the program to finish

                boolean finished=run.waitFor(req.timeLimitMs(),TimeUnit.MILLISECONDS);
                long timeMs=System.currentTimeMillis()-start;
                if(!finished){
                    run.destroyForcibly();
                    results.add(new CaseResult("","Time Limit Exceeded",timeMs,true));
                    continue;
                }

                // Read stdout (normal output) and stderr (runtime crash errors)
                String out=new String(run.getInputStream().readAllBytes());
                String err=new String(run.getErrorStream().readAllBytes());
                results.add(new CaseResult(out,err,timeMs,false));
            }

            return new ExecResponse(null,results);

        }catch(Exception e){
            return new ExecResponse("Executor Error: "+e.getMessage(),List.of());
        } finally{
             // Always clean up the temp folder when done so disk never fills up!
            if(dir!=null){
                try(var walk=Files.walk(dir)){
                    walk.sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
                }catch(Exception ignored){}
            }
        }
    }
}
